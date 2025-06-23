/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
/* Native Dependencies */
import { AiChatCompiledMessage } from '@client/modules/ai/classes/ai-chat-compiled-message.class';
import { AiAgentDefinition } from '@client/modules/ai/classes/ai-agent-definition.class';

@Component({
	selector: 'orc-ai-chat-message-assistant',
	standalone: false,
	templateUrl: './ai-chat-message-assistant.component.html',
	styleUrl: './ai-chat-message-assistant.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiChatMessageAssistantComponent {

	@Input() public message!: AiChatCompiledMessage;
	@Input() public revision!: number;
	@Input() public agent!: AiAgentDefinition | null;

}
