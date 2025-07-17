/* Core Dependencies */
import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal} from '@angular/core';
/* Native Dependencies */
import {AiChatConversation} from '@client/modules/ai/classes/ai-chat-conversation.class';
import {AiAgentDefinition} from '@client/modules/ai/classes/ai-agent-definition.class';

@Component({
	selector: 'orc-ai-chat-log',
	standalone: false,
	templateUrl: './ai-chat-log.component.html',
	styleUrl: './ai-chat-log.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiChatLogComponent {
	@Input() public conversation!: AiChatConversation | null;
	@Input() public active_chat!: boolean;
	@Input() public revision!: number;
	@Input() public agent_definition!: AiAgentDefinition | null;

	@Output() public clear = new EventEmitter<void>();

	public view = signal(1);

	public setView(index: number) {
		this.view.set(index);
	}
}
