/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
/* Native Dependencies */
import { AiChatCompiledMessage } from '@client/modules/ai/classes/ai-chat-compiled-message.class';

@Component({
	selector: 'orc-ai-chat-message-user',
	standalone: false,
	templateUrl: './ai-chat-message-user.component.html',
	styleUrl: './ai-chat-message-user.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiChatMessageUserComponent {

	@Input() public message!: AiChatCompiledMessage;

}
