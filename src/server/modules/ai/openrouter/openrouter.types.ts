/**
 * Raw OpenRouter API response types
 * These represent the wire format from OpenRouter's REST API.
 */

/* *******************************************************
	GET /models
******************************************************** */

export type OpenRouterModelsResponse = {
	data: OpenRouterModel[];
};

export type OpenRouterModel = {
	id: string;
	name: string;
	created: number;
	context_length: number;
	architecture: OpenRouterArchitecture;
	pricing: OpenRouterPricing;
	top_provider: OpenRouterTopProvider;
};

export type OpenRouterArchitecture = {
	modality: string;
	tokenizer: string;
	instruct_type: string | null;
};

export type OpenRouterPricing = {
	prompt: string;
	completion: string;
};

export type OpenRouterTopProvider = {
	max_completion_tokens: number | null;
	is_moderated: boolean;
};

/* *******************************************************
	POST /chat/completions (SSE streaming)
******************************************************** */

export type OpenRouterChatChunk = {
	id: string;
	object: string;
	created: number;
	model: string;
	choices: OpenRouterChoice[];
	usage?: OpenRouterUsage;
};

export type OpenRouterChoice = {
	index: number;
	delta: OpenRouterDelta;
	finish_reason: string | null;
};

export type OpenRouterDelta = {
	role?: string;
	content?: string | null;
	tool_calls?: OpenRouterToolCallDelta[];
};

export type OpenRouterToolCallDelta = {
	index: number;
	id?: string;
	type?: string;
	function: {
		name?: string;
		arguments?: string;
	};
};

export type OpenRouterUsage = {
	prompt_tokens: number;
	completion_tokens: number;
	total_tokens: number;
};

