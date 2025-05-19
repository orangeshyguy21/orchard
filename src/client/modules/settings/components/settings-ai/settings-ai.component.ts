/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
/* Application Dependencies */
import { AiModel } from '@client/modules/ai/classes/ai-model.class';

@Component({
	selector: 'orc-settings-ai',
	standalone: false,
	templateUrl: './settings-ai.component.html',
	styleUrl: './settings-ai.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsAiComponent {

	@Input() public loading!: boolean;
	@Input() public models!: AiModel[];

	constructor() {}

}
