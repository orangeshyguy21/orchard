/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input, Output, EventEmitter} from '@angular/core';
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
	@Input() model!: string | null;
	@Input() model_options!: AiModel[];

	@Output() modelChange = new EventEmitter<string>();
}
