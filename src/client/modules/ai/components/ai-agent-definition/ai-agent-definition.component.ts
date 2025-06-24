/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
/* Native Dependencies */
import { AiAgentDefinition } from '@client/modules/ai/classes/ai-agent-definition.class';

@Component({
	selector: 'orc-ai-agent-definition',
	standalone: false,
	templateUrl: './ai-agent-definition.component.html',
	styleUrl: './ai-agent-definition.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiAgentDefinitionComponent {

	@Input() public agent!: AiAgentDefinition | null;

}
