/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
/* Native Dependencies */
import { AiChatConversation } from '@client/modules/ai/classes/ai-chat-conversation.class';
import { AiAgentDefinition } from '@client/modules/ai/classes/ai-agent-definition.class';

@Component({
	selector: 'orc-ai-chat-log',
	standalone: false,
	templateUrl: './ai-chat-log.component.html',
	styleUrl: './ai-chat-log.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiChatLogComponent {

	@Input() public conversation!: AiChatConversation | null;
	@Input() public revision!: number;
	@Input() public agent_definition!: AiAgentDefinition | null;

}
