/* Local Dependencies */
import {AiTool} from '../ai.types';

/* *******************************************************
	Agent Context
******************************************************** */

/** Identity context passed from agent execution into tool calls */
export type AiAgentContext = {
	agent_id: string;
	agent_name: string;
};

/* *******************************************************
	Tool Results
******************************************************** */

/** Result returned from a tool execution */
export type AiToolResult = {
	success: boolean;
	data?: unknown;
	error?: string;
};

/* *******************************************************
	Tool Handlers
******************************************************** */

/** Custom handler function for non-GraphQL tools */
export type AiToolHandler = (args: Record<string, unknown>) => Promise<AiToolResult>;

/* *******************************************************
	Tool Registry
******************************************************** */

/**
 * Registration entry for an AI tool.
 * Supports two execution modes:
 * - `query`: GraphQL query string executed against the compiled schema (default path for data tools)
 * - `handler`: Custom function for non-API tools (external APIs, calculations, notifications, etc.)
 */
export type AiToolEntry = {
	tool: AiTool;
	throttle_max_calls: number;
	throttle_window_seconds: number;
	query?: string;
	handler?: AiToolHandler;
};
