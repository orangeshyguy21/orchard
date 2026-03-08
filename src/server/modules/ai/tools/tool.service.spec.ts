/* Vendor Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {GraphQLSchemaHost} from '@nestjs/graphql';
import {makeExecutableSchema} from '@graphql-tools/schema';
/* Application Dependencies */
import {AgentFunctionName} from '@server/modules/ai/agent/agent.enums';
/* Local Dependencies */
import {ToolService} from './tool.service';

const mock_schema = makeExecutableSchema({
	typeDefs: `
		scalar UnixTimestamp
		scalar Timezone

		enum AnalyticsInterval { hour day week month custom }
		enum LightningAnalyticsMetric {
			payments_out payments_failed payments_pending
			invoices_in forward_fees
			channel_opens channel_closes
			channel_opens_remote channel_closes_remote
		}

		type Query {
			lightning_analytics(
				date_start: UnixTimestamp,
				date_end: UnixTimestamp,
				interval: AnalyticsInterval,
				timezone: Timezone,
				metrics: [LightningAnalyticsMetric!]
			): [LightningAnalytic!]!
		}

		type LightningAnalytic {
			unit: String!
			metric: String!
			amount: String!
			date: Int!
		}
	`,
	resolvers: {
		Query: {
			lightning_analytics: () => [{unit: 'msat', metric: 'invoices_in', amount: '1000', date: 1700000000}],
		},
	},
});

describe('ToolService', () => {
	let service: ToolService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ToolService,
				{provide: GraphQLSchemaHost, useValue: {schema: mock_schema}},
			],
		}).compile();
		service = module.get<ToolService>(ToolService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('getToolSchemas', () => {
		it('returns schemas for registered tools', () => {
			const schemas = service.getToolSchemas([AgentFunctionName.GET_LIGHTNING_ANALYTICS]);
			expect(schemas).toHaveLength(1);
			expect(schemas[0].function.name).toBe(AgentFunctionName.GET_LIGHTNING_ANALYTICS);
		});

		it('returns empty array for unknown tool names', () => {
			const schemas = service.getToolSchemas(['UNKNOWN_TOOL']);
			expect(schemas).toHaveLength(0);
		});

		it('filters out unknown names from mixed input', () => {
			const schemas = service.getToolSchemas([AgentFunctionName.GET_LIGHTNING_ANALYTICS, 'UNKNOWN']);
			expect(schemas).toHaveLength(1);
		});
	});

	describe('getRegisteredTools', () => {
		it('returns all registered tool names', () => {
			const tools = service.getRegisteredTools();
			expect(tools).toContain(AgentFunctionName.GET_LIGHTNING_ANALYTICS);
		});
	});

	describe('executeTool', () => {
		it('returns error for unknown tool', async () => {
			const result = await service.executeTool('FAKE_TOOL', {});
			expect(result.success).toBe(false);
			expect(result.error).toContain('Unknown tool');
		});

		it('executes a GraphQL-backed tool', async () => {
			const result = await service.executeTool(AgentFunctionName.GET_LIGHTNING_ANALYTICS, {});
			expect(result.success).toBe(true);
			expect(result.data).toBeDefined();
		});
	});

	describe('throttling', () => {
		it('allows calls within the bucket limit', async () => {
			for (let i = 0; i < 5; i++) {
				const result = await service.executeTool(AgentFunctionName.GET_LIGHTNING_ANALYTICS, {});
				expect(result.success).toBe(true);
			}
		});

		it('throttles when bucket limit is exceeded', async () => {
			/* Lightning analytics allows 15 calls per 60s — fill the bucket */
			for (let i = 0; i < 15; i++) {
				await service.executeTool(AgentFunctionName.GET_LIGHTNING_ANALYTICS, {});
			}
			const result = await service.executeTool(AgentFunctionName.GET_LIGHTNING_ANALYTICS, {});
			expect(result.success).toBe(false);
			expect(result.error).toContain('throttled');
		});
	});
});
