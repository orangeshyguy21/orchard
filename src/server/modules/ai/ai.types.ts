/* Local Dependencies */
import {AiMessageRole, AiFunctionName} from './ai.enums';

export type AiModel = {
	name: string;
	model: string;
	modified_at: string;
	size: number;
	digest: string;
	details: AiModelDetails;
};

export type AiModelDetails = {
	parent_model: string;
	format: string;
	family: string;
	families: string[];
	parameter_size: string;
	quantization_level: string;
};

export type AiMessage = {
	role: AiMessageRole;
	content: string;
	thinking?: string;
	tool_calls?: AiToolCall[];
};

export type AiToolParameters = {
	type: string;
	properties: Record<string, unknown>;
	required: string[];
};

export type AiTool = {
	type: string;
	function: AiToolFunction;
};

export type AiToolFunction = {
	name: string;
	description: string;
	parameters: AiToolParameters;
};

export type AiToolCall = {
	function: {
		name: AiFunctionName;
		arguments: AiToolParameters;
	};
};
