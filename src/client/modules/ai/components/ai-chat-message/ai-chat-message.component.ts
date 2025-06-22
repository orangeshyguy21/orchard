/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
/* Native Dependencies */
import { AiChatCompiledMessage } from '@client/modules/ai/classes/ai-chat-compiled-message.class';

@Component({
	selector: 'orc-ai-chat-message',
	standalone: false,
	templateUrl: './ai-chat-message.component.html',
	styleUrl: './ai-chat-message.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiChatMessageComponent {

	@Input() public message!: AiChatCompiledMessage;

}
