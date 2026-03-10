/* Core Dependencies */
import {Injectable, Logger, Optional} from '@nestjs/common';
import {ModuleRef} from '@nestjs/core';
/* Vendor Dependencies */
import {GraphQLSchemaHost} from '@nestjs/graphql';
import {DocumentNode, GraphQLSchema, execute, parse} from 'graphql';
import {DateTime} from 'luxon';
/* Application Dependencies */
import {AiTool} from '@server/modules/ai/ai.types';
import {AgentFunctionName} from '@server/modules/ai/agent/agent.enums';
import {
	GetBitcoinBlockchainInfoTool,
	GetBitcoinNetworkInfoTool,
	GetPortHealthTool,
	GetUrlHealthTool,
	GetLightningAnalyticsBalancesTool,
	GetLightningAnalyticsMetricsTool,
	GetLightningInfoTool,
	GetMintAnalyticsMetricsTool,
	GetMintAnalyticsTool,
	GetMintInfoTool,
	GetPastRunsTool,
	createSendNotificationTool,
} from '@server/modules/ai/agent/tools';
import {NotificationService} from '@server/modules/notification/notification.service';
/* Local Dependencies */
import {AiToolResult, AiToolEntry} from './tool.types';

@Injectable()
export class ToolService {
	private readonly logger = new Logger(ToolService.name);
	private readonly registry = new Map<string, AiToolEntry>();
	private readonly call_log = new Map<string, number[]>();
	private readonly parsed_queries = new Map<string, DocumentNode>();
	private schema: GraphQLSchema | null = null;

	constructor(
		private readonly moduleRef: ModuleRef,
		@Optional() private readonly notificationService?: NotificationService,
	) {
		this.register(AgentFunctionName.GET_BITCOIN_BLOCKCHAIN_INFO, GetBitcoinBlockchainInfoTool);
		this.register(AgentFunctionName.GET_BITCOIN_NETWORK_INFO, GetBitcoinNetworkInfoTool);
		this.register(AgentFunctionName.GET_PORT_HEALTH, GetPortHealthTool);
		this.register(AgentFunctionName.GET_URL_HEALTH, GetUrlHealthTool);
		this.register(AgentFunctionName.GET_LIGHTNING_ANALYTICS_BALANCES, GetLightningAnalyticsBalancesTool);
		this.register(AgentFunctionName.GET_LIGHTNING_ANALYTICS_METRICS, GetLightningAnalyticsMetricsTool);
		this.register(AgentFunctionName.GET_LIGHTNING_INFO, GetLightningInfoTool);
		this.register(AgentFunctionName.GET_MINT_ANALYTICS, GetMintAnalyticsTool);
		this.register(AgentFunctionName.GET_MINT_ANALYTICS_METRICS, GetMintAnalyticsMetricsTool);
		this.register(AgentFunctionName.GET_MINT_INFO, GetMintInfoTool);
		this.register(AgentFunctionName.GET_PAST_RUNS, GetPastRunsTool);
		this.register(AgentFunctionName.SEND_NOTIFICATION, createSendNotificationTool(this.notificationService));
	}

	/* *******************************************************
		Registration
	******************************************************** */

	/** Register a tool entry in the registry, pre-parsing any GraphQL query */
	private register(name: AgentFunctionName, entry: AiToolEntry): void {
		this.registry.set(name, entry);
		if (entry.query) {
			this.parsed_queries.set(name, parse(entry.query));
		}
		this.logger.log(`Registered agent tool: ${name}`);
	}

	/* *******************************************************
		Schema Resolution
	******************************************************** */

	/** Get LLM-compatible tool schemas for a list of tool names */
	public getToolSchemas(tool_names: string[]): AiTool[] {
		return tool_names.map((name) => this.registry.get(name)?.tool).filter((t): t is AiTool => t !== undefined);
	}

	/** Get all registered tool names */
	public getRegisteredTools(): string[] {
		return Array.from(this.registry.keys());
	}

	/* *******************************************************
		Execution
	******************************************************** */

	/**
	 * Execute a tool by name with bucket-based throttle enforcement.
	 * Dispatches to GraphQL query or custom handler based on tool entry config.
	 */
	public async executeTool(name: string, args: Record<string, unknown>): Promise<AiToolResult> {
		const entry = this.registry.get(name);
		if (!entry) {
			return {success: false, error: `Unknown tool: ${name}`};
		}

		const throttle_error = this.checkThrottle(name, entry);
		if (throttle_error) {
			return {success: false, error: throttle_error};
		}

		this.recordCall(name);

		try {
			if (entry.query) {
				return await this.executeGraphQL(name, args);
			} else if (entry.handler) {
				return await entry.handler(args);
			}
			return {success: false, error: `Tool ${name} has no query or handler configured`};
		} catch (error) {
			this.logger.error(`Tool ${name} failed: ${error.message}`);
			return {success: false, error: error.message};
		}
	}

	/* *******************************************************
		Throttling
	******************************************************** */

	/**
	 * Bucket-based throttle check.
	 * Returns an error message if the tool has exceeded its call limit, null otherwise.
	 */
	private checkThrottle(name: string, entry: AiToolEntry): string | null {
		const now = DateTime.utc().toUnixInteger();
		const window_start = now - entry.throttle_window_seconds;
		const timestamps = this.call_log.get(name) ?? [];
		const recent_calls = timestamps.filter((t) => t > window_start);
		if (recent_calls.length >= entry.throttle_max_calls) {
			return `Tool ${name} is throttled: ${entry.throttle_max_calls} calls per ${entry.throttle_window_seconds}s limit reached.`;
		}
		return null;
	}

	/** Record a tool call timestamp and prune old entries */
	private recordCall(name: string): void {
		const now = DateTime.utc().toUnixInteger();
		const timestamps = this.call_log.get(name) ?? [];
		timestamps.push(now);
		/* Keep only the last 100 entries to prevent unbounded growth */
		if (timestamps.length > 100) {
			timestamps.splice(0, timestamps.length - 100);
		}
		this.call_log.set(name, timestamps);
	}

	/* *******************************************************
		GraphQL Execution
	******************************************************** */

	/**
	 * Execute a pre-parsed GraphQL query against the compiled schema.
	 * Uses the same resolver pipeline as the HTTP API.
	 */
	private async executeGraphQL(name: string, variables: Record<string, unknown>): Promise<AiToolResult> {
		if (!this.schema) {
			this.schema = this.moduleRef.get(GraphQLSchemaHost, {strict: false}).schema;
		}
		const document = this.parsed_queries.get(name)!;
		const result = await execute({
			schema: this.schema,
			document,
			variableValues: variables,
			contextValue: {req: {headers: {}, user: {id: 'agent', name: 'agent', role: 'ADMIN'}}},
		});

		if (result.errors?.length) {
			const messages = result.errors.map((e) => e.message).join('; ');
			this.logger.warn(`GraphQL execution error: ${messages}`);
			return {success: false, error: messages};
		}

		return {success: true, data: result.data};
	}
}
