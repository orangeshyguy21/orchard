/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
/* Native Dependencies */
import { AiChatToolCall } from '@client/modules/ai/classes/ai-chat-chunk.class';

@Component({
	selector: 'orc-ai-chat-message-toolcall',
	standalone: false,
	templateUrl: './ai-chat-message-toolcall.component.html',
	styleUrl: './ai-chat-message-toolcall.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiChatMessageToolcallComponent {

	@Input() tool_call!: AiChatToolCall;
	
}
