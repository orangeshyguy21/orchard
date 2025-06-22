/* Local Dependencies */
import { AiChatCompiledMessage } from "./ai-chat-compiled-message.class";
/* Shared Dependencies */
import { AiAgent } from "@shared/generated.types";

export class AiChatConversation {
    public id: string;
    public messages: AiChatCompiledMessage[];
    public agent: AiAgent;

    constructor(id: string, messages: AiChatCompiledMessage[], agent: AiAgent) {
        this.id = id;
        this.messages = messages;
        this.agent = agent;
    }
}