/* Native Dependencies */
import { AiChatMessage } from '@client/modules/ai/classes/ai-chat-chunk.class';
/* Local Dependencies */
import { AiChatCompiledMessage } from "./ai-chat-compiled-message.class";
/* Shared Dependencies */
import { AiAgent, AiMessageRole } from "@shared/generated.types";

export class AiChatConversation {
    public id: string;
    public messages: AiChatCompiledMessage[];
    public agent: AiAgent;

    public get message_count_assistant(): number {
        return this.messages.filter((message) => message.role === AiMessageRole.Assistant).length;
    }

    constructor(id: string, messages: AiChatCompiledMessage[], agent: AiAgent) {
        this.id = id;
        this.messages = messages;
        this.agent = agent;
    }

    public getMessages(): AiChatMessage[] {
        return this.messages.map((message) => message.getMessage());
    }
}