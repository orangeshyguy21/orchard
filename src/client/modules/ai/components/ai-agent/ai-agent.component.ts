/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
/* Native Dependencies */
import { AiAgentDefinition } from '@client/modules/ai/classes/ai-agent-definition.class';
/* Shared Dependencies */
import { AiMessageRole } from '@shared/generated.types';

@Component({
	selector: 'orc-ai-agent',
	standalone: false,
	templateUrl: './ai-agent.component.html',
	styleUrl: './ai-agent.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiAgentComponent {

	@Input() public agent!: AiAgentDefinition | null;

	public role = AiMessageRole.Assistant;

}
