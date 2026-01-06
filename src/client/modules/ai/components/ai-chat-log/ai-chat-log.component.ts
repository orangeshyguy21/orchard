/* Core Dependencies */
import {ChangeDetectionStrategy, Component, EventEmitter, input, output, signal} from '@angular/core';
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
	public conversation = input.required<AiChatConversation | null>();
	public active_chat = input.required<boolean>();
	public revision = input.required<number>();
	public agent_definition = input.required<AiAgentDefinition | null>();

	public clear = output<void>();
	public close = output<void>();

	public view = signal(1);

	public setView(index: number) {
		this.view.set(index);
	}
}
