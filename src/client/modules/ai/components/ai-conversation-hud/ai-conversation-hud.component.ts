/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
/* Native Dependencies */
import { AiChatConversation } from '@client/modules/ai/classes/ai-chat-conversation.class';

@Component({
	selector: 'orc-ai-conversation-hud',
	standalone: false,
	templateUrl: './ai-conversation-hud.component.html',
	styleUrl: './ai-conversation-hud.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiConversationHudComponent {

	@Output() toggle = new EventEmitter<void>();

	@Input() conversations!: AiChatConversation[];
	@Input() clength!: number;

}
