/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
/* Native Dependencies */
import {AiAssistantDefinition} from '@client/modules/ai/classes/ai-assistant-definition.class';

@Component({
	selector: 'orc-ai-assistant-definition',
	standalone: false,
	templateUrl: './ai-assistant-definition.component.html',
	styleUrl: './ai-assistant-definition.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiAssistantDefinitionComponent {
	@Input() public assistant!: AiAssistantDefinition | null;
}
