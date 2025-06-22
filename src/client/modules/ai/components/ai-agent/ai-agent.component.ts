/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
/* Shared Dependencies */
import { AiAgentDefinition } from '@client/modules/ai/classes/ai-agent-definition.class';

@Component({
	selector: 'orc-ai-agent',
	standalone: false,
	templateUrl: './ai-agent.component.html',
	styleUrl: './ai-agent.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiAgentComponent {

	@Input() public agent!: AiAgentDefinition | null;

}
