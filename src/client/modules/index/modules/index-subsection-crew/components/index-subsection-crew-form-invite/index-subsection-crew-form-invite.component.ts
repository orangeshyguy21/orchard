/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, output, computed, signal, OnInit, ViewChild, effect} from '@angular/core';
import {FormGroup} from '@angular/forms';
/* Vendor Dependencies */
import {DateTime} from 'luxon';
import {Observable} from 'rxjs';
import {startWith, map} from 'rxjs/operators';
import {MatAutocompleteTrigger, MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatCheckboxChange} from '@angular/material/checkbox';
/* Application Dependencies */
import {SettingService} from '@client/modules/settings/services/setting/setting.service';
/* Shared Dependencies */
import {UserRole} from '@shared/generated.types';

type TimeOption = {
	value: number;
	label: string;
};

@Component({
	selector: 'orc-index-subsection-crew-form-invite',
	standalone: false,
	templateUrl: './index-subsection-crew-form-invite.component.html',
	styleUrl: './index-subsection-crew-form-invite.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexSubsectionCrewFormInviteComponent implements OnInit {
	@ViewChild(MatAutocompleteTrigger) time_trigger!: MatAutocompleteTrigger;
	@ViewChild(MatAutocomplete) time_auto!: MatAutocomplete;

	public form_group = input.required<FormGroup>();
	public open = input.required<boolean>();

	public close = output<void>();
	public cancel = output<string>();

	public focused_label = signal<boolean>(false);

	public dirty_label = computed(() => {
		const control = this.form_group().get('label');
		if (!control) return false;
		return control.dirty;
	});

	public user_role_options: {value: UserRole; label: string}[] = [
		{value: UserRole.Admin, label: 'Admin'},
		{value: UserRole.Manager, label: 'Manager'},
		{value: UserRole.Reader, label: 'Reader'},
	];
	public time_options: TimeOption[] = [];

	public filtered_options!: Observable<TimeOption[]>;

	constructor(private settingService: SettingService) {
		effect(() => {
			if (this.open()) {
				this.time_auto.options.find((option) => option.value === this.form_group().get('expiration_time')?.value)?.select();
			}
		});
	}

	ngOnInit(): void {
		this.time_options = this.generateTimeOptions();
		this.setFilteredOptions();
	}

	/**
	 * Generate time options (0-23 hours) with labels formatted according to user's locale
	 * @returns {TimeOption[]} Array of time options with value and formatted label
	 */
	private generateTimeOptions(): TimeOption[] {
		const locale = this.settingService.getLocale();
		const options: TimeOption[] = [];

		for (let hour = 0; hour < 24; hour++) {
			const date_time = DateTime.now().set({hour, minute: 0, second: 0});
			const label = date_time.toLocaleString({hour: 'numeric', minute: '2-digit'}, {locale});
			options.push({value: hour, label});
		}

		return options;
	}

	private setFilteredOptions() {
		const control = this.form_group().get('expiration_time');
		if (!control) return;
		this.filtered_options = control.valueChanges.pipe(
			startWith(''),
			map((value) => this._filter(value || '')),
		);
	}

	private _filter(value: string | number): TimeOption[] {
		if (typeof value === 'number') return this.time_options;
		if (value === '') return this.time_options;
		const matches_selection = this.time_options.some((option) => option.label === value.toString());
		if (matches_selection) return this.time_options;
		const filter_value = value.toString().toLowerCase();
		return this.time_options.filter((option) => option.label.toLowerCase().includes(filter_value));
	}

	/**
	 * Display function for autocomplete to show formatted time label instead of numeric value
	 * @param {number} value - The hour value (0-23)
	 * @returns {string} The formatted time label
	 */
	public displayTime = (value: number): string => {
		const option = this.time_options.find((opt) => opt.value === value);
		return option ? option.label : '';
	};

	public onCancelLabel(event: Event): void {
		event.preventDefault();
		this.focused_label.set(false);
		// emit event to clear from parent
	}

	public onExpirationEnabledChange(event: MatCheckboxChange): void {
		const expiration_enabled = event.checked;
		if (expiration_enabled) {
			this.form_group().get('expiration_date')?.enable();
			this.form_group().get('expiration_time')?.enable();
		} else {
			this.form_group().get('expiration_date')?.disable();
			this.form_group().get('expiration_time')?.disable();
		}
	}
}
