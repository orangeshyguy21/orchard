/* Native Dependencies */
import {AiChatMessage} from '@client/modules/ai/classes/ai-chat-chunk.class';
/* Local Dependencies */
import {AiChatCompiledMessage} from './ai-chat-compiled-message.class';
/* Shared Dependencies */
import {AiAssistant} from '@shared/generated.types';

export class AiChatConversation {
	public id: string;
	public messages: AiChatCompiledMessage[];
	public assistant: AiAssistant;

	constructor(id: string, messages: AiChatCompiledMessage[], assistant: AiAssistant) {
		this.id = id;
		this.messages = messages;
		this.assistant = assistant;
	}

	public getMessages(): AiChatMessage[] {
		return this.messages.map((message) => message.getMessage());
	}
}
