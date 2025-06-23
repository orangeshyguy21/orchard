/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
/* Native Dependencies */
import { AiChatCompiledMessage } from '@client/modules/ai/classes/ai-chat-compiled-message.class';

@Component({
	selector: 'orc-ai-chat-message-system',
	standalone: false,
	templateUrl: './ai-chat-message-system.component.html',
	styleUrl: './ai-chat-message-system.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiChatMessageSystemComponent {

	@Input() public message!: AiChatCompiledMessage;

}
