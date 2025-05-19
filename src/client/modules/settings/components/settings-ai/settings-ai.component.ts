/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, computed } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
/* Vendor Dependencies */
import { Observable } from 'rxjs';
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
	@Input() public error!: boolean;
	@Input() public models!: AiModel[];

	public model_control = new FormControl('', [Validators.required]);
	public filtered_options!: Observable<AiModel[]>;

	public model_control_error = computed(() => {
		if (this.model_control.hasError('required')) return 'required';
		if (this.model_control.hasError('invalid_model')) return 'invalid model';
		return '';
	});

	constructor() {}

}
