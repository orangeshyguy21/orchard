/**
 * Raw Ollama API response types
 * These represent the wire format from Ollama's REST API.
 */

/* *******************************************************
	GET /api/tags
******************************************************** */

export type OllamaTagsResponse = {
	models: OllamaModel[];
};

export type OllamaModel = {
	name: string;
	model: string;
	modified_at: string;
	size: number;
	digest: string;
	details: OllamaModelDetails;
};

export type OllamaModelDetails = {
	parent_model: string;
	format: string;
	family: string;
	families: string[];
	parameter_size: string;
	quantization_level: string;
};

/* *******************************************************
	POST /api/chat (NDJSON streaming)
******************************************************** */

export type OllamaChatChunk = {
	model: string;
	created_at: string;
	message: OllamaChatMessage;
	done: boolean;
	done_reason?: string;
	total_duration?: number;
	load_duration?: number;
	prompt_eval_count?: number;
	prompt_eval_duration?: number;
	eval_count?: number;
	eval_duration?: number;
	error?: string;
};

export type OllamaChatMessage = {
	role: string;
	content: string;
	thinking?: string;
	tool_calls?: OllamaToolCall[];
};

export type OllamaToolCall = {
	function: {
		name: string;
		arguments: Record<string, unknown>;
	};
};
