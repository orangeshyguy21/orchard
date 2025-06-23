/* Native Dependencies */
import { AiChatChunk, AiChatMessage, AiChatToolCall } from '@client/modules/ai/classes/ai-chat-chunk.class';
/* Shared Dependencies */
import { AiMessageRole } from "@shared/generated.types";

export class AiChatCompiledMessage {

    public id: string;
    public id_conversation: string;
    public content: string;
    public role: AiMessageRole;
    public tool_calls?: AiChatToolCall[];
    public done: boolean;

    constructor( id_conversation: string, message: AiChatMessage) {
        this.id = crypto.randomUUID();
        this.id_conversation = id_conversation;
        this.content = message.content;
        this.role = message.role;
        this.tool_calls = message.tool_calls || [];
        this.done = false;
    }
    
    public integrateChunk(chunk: AiChatChunk): void {
        this.content += chunk.message.content;
        if( chunk.message.tool_calls ) this.tool_calls?.push(...chunk.message.tool_calls);
        if( chunk.done ) this.done = true;
    }
}