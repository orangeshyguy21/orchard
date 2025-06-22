/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
/* Native Dependencies */
import { AiChatConversation } from '@client/modules/ai/classes/ai-chat-conversation.class';

@Component({
	selector: 'orc-ai-chat-log',
	standalone: false,
	templateUrl: './ai-chat-log.component.html',
	styleUrl: './ai-chat-log.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiChatLogComponent {

	@Input() public conversation!: AiChatConversation | null;
	@Input() public update_count!: number;

}
