/* Core Dependencies */
import {ChangeDetectionStrategy, Component, effect, input, output, signal, viewChild} from '@angular/core';
import {FormGroup, FormControl, FormArray, Validators} from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
/* Vendor Dependencies */
import {DateTime} from 'luxon';
import {ENTER, COMMA} from '@angular/cdk/keycodes';
import {MatMenuTrigger} from '@angular/material/menu';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocompleteSelectedEvent, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {DateRange} from '@angular/material/datepicker';
import {Observable, map, startWith} from 'rxjs';
/* Application Dependencies */
import {User} from '@client/modules/crew/classes/user.class';
import {DateRangePreset} from '@client/modules/form/types/form-daterange.types';
import {DeviceType} from '@client/modules/layout/types/device.types';
/* Shared Dependencies */
import {EventLogSection, EventLogType, EventLogStatus} from '@shared/generated.types';

@Component({
	selector: 'orc-event-subsection-log-control',
	standalone: false,
	templateUrl: './event-subsection-log-control.component.html',
	styleUrl: './event-subsection-log-control.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventSubsectionLogControlComponent {
	/* Inputs */
	public readonly date_start = input<number | null>();
	public readonly date_end = input<number | null>();
	public readonly sections = input<EventLogSection[]>([]);
	public readonly actor_ids = input<string[]>([]);
	public readonly types = input<EventLogType[]>([]);
	public readonly statuses = input<EventLogStatus[]>([]);
	public readonly users = input<User[]>([]);
	public readonly device_type = input.required<DeviceType>();
	public readonly date_preset = input<DateRangePreset | null>(null);

	/* Outputs */
	public readonly dateChange = output<number[]>();
	public readonly presetChange = output<DateRangePreset>();
	public readonly sectionsChange = output<EventLogSection[]>();
	public readonly actorIdsChange = output<string[]>();
	public readonly typesChange = output<EventLogType[]>();
	public readonly statusesChange = output<EventLogStatus[]>();
	public readonly resetFilter = output<void>();

	private readonly filter_menu_trigger = viewChild(MatMenuTrigger);
	private readonly user_auto_trigger = viewChild(MatAutocompleteTrigger);

	/* Form */
	public readonly panel = new FormGroup({
		sections: new FormArray<FormControl<boolean>>([]),
		actor_ids: new FormControl<string[]>([], {nonNullable: true}),
		types: new FormArray<FormControl<boolean>>([]),
		statuses: new FormArray<FormControl<boolean>>([]),
		daterange: new FormGroup({
			date_start: new FormControl<DateTime | null>(null, [Validators.required]),
			date_end: new FormControl<DateTime | null>(null, [Validators.required]),
		}),
	});

	/* User chip autocomplete */
	public readonly separator_codes: number[] = [ENTER, COMMA];
	public readonly user_search_control = new FormControl('');
	public filtered_users: Observable<User[]>;
	public readonly selected_users = signal<User[]>([]);

	/* Enum options */
	public readonly section_options = Object.values(EventLogSection);
	public readonly type_options = Object.values(EventLogType);
	public readonly status_options = Object.values(EventLogStatus);

	/* State */
	public readonly filter_count = signal(0);

	public get height_state(): string {
		return this.panel?.invalid ? 'invalid' : 'valid';
	}

	constructor() {
		this.panel
			.get('daterange')
			?.statusChanges.pipe(takeUntilDestroyed())
			.subscribe(() => {});

		/* Initialize user autocomplete filtering */
		this.filtered_users = this.user_search_control.valueChanges.pipe(
			startWith(''),
			map((value) => this.filterUsers(value || '')),
		);

		/* Build checkbox FormArrays */
		this.buildSectionFilters();
		this.buildTypeFilters();
		this.buildStatusFilters();

		/* Sync date inputs to form */
		effect(() => {
			const ds = this.date_start();
			if (ds) this.panel.controls.daterange.controls.date_start.setValue(DateTime.fromSeconds(ds), {emitEvent: false});
		});
		effect(() => {
			const de = this.date_end();
			if (de) this.panel.controls.daterange.controls.date_end.setValue(DateTime.fromSeconds(de), {emitEvent: false});
		});

		/* Sync checkbox inputs to form */
		effect(() => {
			const sections = this.sections();
			if (this.areArraysEqual(this.getSelectedSections(), sections)) return;
			this.setSectionFilters(sections);
			this.updateFilterCount();
		});
		effect(() => {
			const types = this.types();
			if (this.areArraysEqual(this.getSelectedTypes(), types)) return;
			this.setTypeFilters(types);
			this.updateFilterCount();
		});
		effect(() => {
			const statuses = this.statuses();
			if (this.areArraysEqual(this.getSelectedStatuses(), statuses)) return;
			this.setStatusFilters(statuses);
			this.updateFilterCount();
		});

		/* Sync actor_ids input to form and selected_users signal */
		effect(() => {
			const ids = this.actor_ids();
			const all_users = this.users();
			const matched = ids.map((id) => all_users.find((u) => u.id === id)).filter((u): u is User => !!u);
			this.selected_users.set(matched);
			this.panel.controls.actor_ids.setValue(ids, {emitEvent: false});
			this.updateFilterCount();
		});
	}

	/* *******************************************************
        Section Filters
    ******************************************************** */

	/** Builds the FormArray controls for section checkboxes */
	private buildSectionFilters(): void {
		this.panel.controls.sections.clear();
		this.section_options.forEach(() => {
			this.panel.controls.sections.push(new FormControl(false, {nonNullable: true}));
		});
	}

	/** Sets the FormArray values based on selected sections */
	private setSectionFilters(selected: EventLogSection[]): void {
		this.section_options.forEach((option, index) => {
			this.panel.controls.sections.at(index).setValue(selected.includes(option));
		});
	}

	/** Gets the selected sections from the FormArray */
	public getSelectedSections(): EventLogSection[] {
		return this.section_options.filter((_, index) => this.panel.controls.sections.at(index).value);
	}

	/* *******************************************************
        Type Filters
    ******************************************************** */

	/** Builds the FormArray controls for type checkboxes */
	private buildTypeFilters(): void {
		this.panel.controls.types.clear();
		this.type_options.forEach(() => {
			this.panel.controls.types.push(new FormControl(false, {nonNullable: true}));
		});
	}

	/** Sets the FormArray values based on selected types */
	private setTypeFilters(selected: EventLogType[]): void {
		this.type_options.forEach((option, index) => {
			this.panel.controls.types.at(index).setValue(selected.includes(option));
		});
	}

	/** Gets the selected types from the FormArray */
	public getSelectedTypes(): EventLogType[] {
		return this.type_options.filter((_, index) => this.panel.controls.types.at(index).value);
	}

	/* *******************************************************
        Status Filters
    ******************************************************** */

	/** Builds the FormArray controls for status checkboxes */
	private buildStatusFilters(): void {
		this.panel.controls.statuses.clear();
		this.status_options.forEach(() => {
			this.panel.controls.statuses.push(new FormControl(false, {nonNullable: true}));
		});
	}

	/** Sets the FormArray values based on selected statuses */
	private setStatusFilters(selected: EventLogStatus[]): void {
		this.status_options.forEach((option, index) => {
			this.panel.controls.statuses.at(index).setValue(selected.includes(option));
		});
	}

	/** Gets the selected statuses from the FormArray */
	public getSelectedStatuses(): EventLogStatus[] {
		return this.status_options.filter((_, index) => this.panel.controls.statuses.at(index).value);
	}

	/* *******************************************************
        User Chip Autocomplete
    ******************************************************** */

	/** Filters users for autocomplete based on search input */
	private filterUsers(value: string): User[] {
		const filter_value = value.toLowerCase();
		const selected_ids = this.selected_users().map((u) => u.id);
		return this.users().filter((user) => {
			if (selected_ids.includes(user.id)) return false;
			return user.name.toLowerCase().includes(filter_value);
		});
	}

	/** Handles chip input token end */
	public onUserAdd(_event: MatChipInputEvent): void {
		this.user_search_control.setValue('');
	}

	/** Handles removing a selected user chip */
	public onUserRemove(user: User): void {
		const updated = this.selected_users().filter((u) => u.id !== user.id);
		this.selected_users.set(updated);
		const ids = updated.map((u) => u.id);
		this.panel.controls.actor_ids.setValue(ids);
		this.actorIdsChange.emit(ids);
		this.updateFilterCount();
		this.refreshUserAutocomplete();
	}

	/** Handles autocomplete selection */
	public onUserSelected(event: MatAutocompleteSelectedEvent): void {
		const user_id = event.option.value;
		const user = this.users().find((u) => u.id === user_id);
		if (!user) return;
		const updated = [...this.selected_users(), user];
		this.selected_users.set(updated);
		const ids = updated.map((u) => u.id);
		this.panel.controls.actor_ids.setValue(ids);
		this.actorIdsChange.emit(ids);
		this.user_search_control.setValue('');
		event.option.deselect();
		this.updateFilterCount();
		setTimeout(() => this.refreshUserAutocomplete());
	}

	/** Triggers autocomplete filtering on focus so the panel appears immediately */
	public onUserInputFocus(): void {
		this.refreshUserAutocomplete();
	}

	/** Closes autocomplete panel on blur (needed because stopPropagation on filter menu blocks outside-click detection) */
	public onUserInputBlur(): void {
		setTimeout(() => this.user_auto_trigger()?.closePanel(), 200);
	}

	/** Refreshes the filtered users observable */
	private refreshUserAutocomplete(): void {
		this.user_search_control.setValue(this.user_search_control.value);
	}

	/* *******************************************************
        Events
    ******************************************************** */

	/** Handles preset selection — emits the preset key for the parent to resolve */
	public onPresetChange(preset: DateRangePreset): void {
		this.presetChange.emit(preset);
	}

	/** Handles calendar date range selection — updates form controls and emits */
	public onDateRangeChange(range: DateRange<DateTime>): void {
		if (range.start) this.panel.controls.daterange.controls.date_start.setValue(range.start);
		if (range.end) this.panel.controls.daterange.controls.date_end.setValue(range.end);
		const ds = this.panel.controls.daterange.controls.date_start.value;
		const de = this.panel.controls.daterange.controls.date_end.value;
		if (!ds || !de) return;
		this.dateChange.emit([Math.floor(ds.startOf('day').toSeconds()), Math.floor(de.endOf('day').toSeconds())]);
	}

	/** Emits date range change when both dates are valid and changed */
	public onDateChange(): void {
		const daterange = this.panel.controls.daterange;
		if (daterange.invalid) return;
		const ds = daterange.controls.date_start.value;
		const de = daterange.controls.date_end.value;
		if (!ds || !de) return;
		const new_start = Math.floor(ds.startOf('day').toSeconds());
		const new_end = Math.floor(de.endOf('day').toSeconds());
		if (new_start === this.date_start() && new_end === this.date_end()) return;
		this.dateChange.emit([new_start, new_end]);
	}

	/** Handles section checkbox change */
	public onSectionsChange(): void {
		this.updateFilterCount();
		this.sectionsChange.emit(this.getSelectedSections());
	}

	/** Handles type checkbox change */
	public onTypesChange(): void {
		this.updateFilterCount();
		this.typesChange.emit(this.getSelectedTypes());
	}

	/** Handles status checkbox change */
	public onStatusesChange(): void {
		this.updateFilterCount();
		this.statusesChange.emit(this.getSelectedStatuses());
	}

	/** Clears all filters in the menu */
	public onClearFilter(): void {
		this.setSectionFilters([]);
		this.setTypeFilters([]);
		this.setStatusFilters([]);
		this.selected_users.set([]);
		this.panel.controls.actor_ids.setValue([]);
		this.user_search_control.setValue('');
		this.resetFilter.emit();
		this.filter_count.set(0);
	}

	/** Closes the filter menu */
	public onCloseFilter(): void {
		this.filter_menu_trigger()?.closeMenu();
	}

	/* *******************************************************
        Helpers
    ******************************************************** */

	/** Counts active filter groups for badge display */
	private updateFilterCount(): void {
		let count = 0;
		if (this.getSelectedSections().length > 0) count++;
		if (this.getSelectedTypes().length > 0) count++;
		if (this.getSelectedStatuses().length > 0) count++;
		if (this.selected_users().length > 0) count++;
		this.filter_count.set(count);
	}

	/** Compares two string arrays for equality */
	private areArraysEqual(a: string[], b: string[]): boolean {
		if (a.length !== b.length) return false;
		const sorted_a = [...a].sort();
		const sorted_b = [...b].sort();
		return sorted_a.every((item, index) => item === sorted_b[index]);
	}
}
