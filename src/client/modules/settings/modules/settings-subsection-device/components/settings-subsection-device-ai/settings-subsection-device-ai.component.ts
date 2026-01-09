/* Core Dependencies */
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	signal,
	computed,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
/* Vendor Dependencies */
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatAutocompleteTrigger, MatAutocomplete} from '@angular/material/autocomplete';
/* Application Dependencies */
import {AiModel} from '@client/modules/ai/classes/ai-model.class';
import {Model} from '@client/modules/cache/services/local-storage/local-storage.types';

@Component({
	selector: 'orc-settings-subsection-device-ai',
	standalone: false,
	templateUrl: './settings-subsection-device-ai.component.html',
	styleUrl: './settings-subsection-device-ai.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSubsectionDeviceAiComponent implements OnChanges {
	@ViewChild(MatAutocompleteTrigger) autotrigger!: MatAutocompleteTrigger;
	@ViewChild(MatAutocomplete) auto!: MatAutocomplete;

	@Input() public enabled!: boolean;
	@Input() public loading!: boolean;
	@Input() public error!: boolean;
	@Input() public model_options!: AiModel[];
	@Input() public model!: Model | null;

	@Output() modelChange = new EventEmitter<string | null>();

	public model_control = new FormControl('', [Validators.required]);
	public filtered_options!: Observable<AiModel[]>;
	public ai_model!: AiModel | null;
	public help_status = signal<boolean>(true);

	public model_control_error = computed(() => {
		if (this.model_control.hasError('required')) return 'required';
		if (this.model_control.hasError('invalid_model')) return 'invalid model';
		return '';
	});

	constructor() {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['loading'] && this.loading === false) this.init();
	}

	private init() {
		if (this.model === null) return;
		this.model_control.setValue(this.model.model);
		this.setFilteredOptions();
		this.setAiModel(this.model.model);
		setTimeout(() => {
			this.auto.options.find((option) => option.value === this.model?.model)?.select();
		});
		this.model_control.valueChanges.subscribe((value) => {
			this.onModelChange(value);
		});
	}

	private setFilteredOptions() {
		this.filtered_options = this.model_control.valueChanges.pipe(
			startWith(''),
			map((value) => this._filter(value || '')),
		);
	}

	private _filter(value: string): AiModel[] {
		const filter_value = value.toLowerCase();
		if (filter_value === this.model?.model) return this.model_options;
		return this.model_options.filter((option) => option.name.toLowerCase().includes(filter_value));
	}

	private setAiModel(model: string | null): any {
		if (model === null) return (this.ai_model = null);
		this.ai_model = this.model_options.find((option) => option.model === model) ?? null;
	}

	public onModelChange(value: string | null): void {
		if (value === null) return this.model_control.setErrors({required: true});
		if (!this.model_options.some((option) => option.model === value)) return this.model_control.setErrors({invalid_model: true});
		this.modelChange.emit(value);
		this.setFilteredOptions();
		this.setAiModel(value);
	}

	public onSubmit(event: Event): void {
		event.preventDefault();
		this.autotrigger.closePanel();
		this.onModelChange(this.model_control.value);
		setTimeout(() => {
			this.auto.options.find((option) => option.value === this.model?.model)?.select();
		});
	}
}
