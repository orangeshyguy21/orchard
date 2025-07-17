/* Native Dependencies */
import {AiChatToolCall} from '@client/modules/ai/classes/ai-chat-chunk.class';

export class ArgumentRow {
	field: string;
	value: string;

	constructor(field: string, value: string) {
		this.field = field;
		this.value = value;
	}
}
