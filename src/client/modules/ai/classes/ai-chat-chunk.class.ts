/* Application Dependencies */
import { AiFunction } from "@client/modules/ai/types/ai.types";
/* Shared Dependencies */
import { OrchardAiChatChunk, OrchardAiChatMessage, OrchardAiChatToolCall, AiMessageRole } from "@shared/generated.types";

interface ParsedOrchardAiChatChunk extends Omit<OrchardAiChatChunk, 'message'> {
    message: {
        content: string;
        role: AiMessageRole;
        tool_calls?: {
            function: AiFunction
        }[];
    };
}

interface ParsedOrchardAiChatMessage extends Omit<OrchardAiChatMessage, 'tool_calls'> {
    tool_calls?: {
        function: AiFunction
    }[];
}

interface ParsedOrchardAiChatToolCall extends Omit<OrchardAiChatToolCall, 'function'> {
    function: AiFunction;
}

export class AiChatChunk implements ParsedOrchardAiChatChunk {

    public created_at: number;
    public done: boolean;
    public done_reason: string | null;
    public eval_count: number | null;
    public eval_duration: number | null;
    public id: string;
    public load_duration: number | null;
    public message: AiChatMessage;
    public model: string;
    public prompt_eval_count: number | null;
    public prompt_eval_duration: number | null;
    public total_duration: number | null;

	constructor(chunk: OrchardAiChatChunk) {
		this.created_at = chunk.created_at;
		this.done = chunk.done;
		this.done_reason = chunk.done_reason ?? null;
		this.eval_count = chunk.eval_count ?? null;
		this.eval_duration = chunk.eval_duration ?? null;
		this.id = chunk.id;
		this.load_duration = chunk.load_duration ?? null;
		this.message = new AiChatMessage(chunk.message);
		this.model = chunk.model;
		this.prompt_eval_count = chunk.prompt_eval_count ?? null;
		this.prompt_eval_duration = chunk.prompt_eval_duration ?? null;
		this.total_duration = chunk.total_duration ?? null;
	}
}

export class AiChatMessage implements ParsedOrchardAiChatMessage {
    public content: string;
    public role: AiMessageRole;
    public tool_calls?: AiChatToolCall[];

    constructor(message: OrchardAiChatMessage) {
        this.content = message.content;
        this.role = message.role;
        this.tool_calls = message.tool_calls?.map((tool_call: OrchardAiChatToolCall) => new AiChatToolCall(tool_call));
    }
}

export class AiChatToolCall implements ParsedOrchardAiChatToolCall {

    public function: AiFunction;

    constructor(tool_call: OrchardAiChatToolCall) {
        this.function = {
            name: tool_call.function.name,
            arguments: JSON.parse(tool_call.function.arguments)
        };
    }
}