/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
/* Application Dependencies */
import {AiModel} from '@client/modules/ai/classes/ai-model.class';

@Component({
	selector: 'orc-ai-model',
	standalone: false,
	templateUrl: './ai-model.component.html',
	styleUrl: './ai-model.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiModelComponent {
	public model = input.required<string | null>();
	public model_options = input.required<AiModel[]>();
	public device_mobile = input.required<boolean>();

	public modelChange = output<string>();
}
