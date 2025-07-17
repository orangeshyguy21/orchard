/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input, Output, EventEmitter, signal, computed} from '@angular/core';
import {ENTER, COMMA} from '@angular/cdk/keycodes';
import {FormControl} from '@angular/forms';
import {Observable, map, startWith} from 'rxjs';
/* Vendor Dependencies */
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
/* Native Dependencies */
import {SettingsCategory} from '@client/modules/settings/enums/category.enum';

@Component({
	selector: 'orc-settings-categories',
	standalone: false,
	templateUrl: './settings-categories.component.html',
	styleUrl: './settings-categories.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsCategoriesComponent {
	@Input() category_filters: SettingsCategory[] = [];

	@Output() updateFilters = new EventEmitter<SettingsCategory[]>();

	public readonly separator_codes: number[] = [ENTER, COMMA];
	public new_category_control = new FormControl('');
	public readonly all_categories: SettingsCategory[] = [
		SettingsCategory.Orchard,
		SettingsCategory.Bitcoin,
		SettingsCategory.Lightning,
		SettingsCategory.Mint,
		SettingsCategory.Ecash,
		SettingsCategory.Local,
	];
	public filtered_options!: Observable<SettingsCategory[]>;

	constructor() {
		this.init();
	}

	private init() {
		this.filtered_options = this.new_category_control.valueChanges.pipe(
			startWith(''),
			map((value) => this._filter(value || '')),
		);
	}

	private _filter(value: string): SettingsCategory[] {
		const filter_value = value.toLowerCase();
		const available_categories = this.all_categories
			.filter((option) => option.toLowerCase().includes(filter_value))
			.filter((option) => !this.category_filters.includes(option));
		return available_categories;
	}

	public add(event: MatChipInputEvent): void {
		const value = (event.value || '').trim();
		if (value) this.updateFilters.emit([...this.category_filters, value as SettingsCategory]);
		this.new_category_control.setValue('');
		this.init();
	}

	public remove(category: string): void {
		this.updateFilters.emit(this.category_filters.filter((c) => c !== category));
		this.init();
	}

	public selected(event: MatAutocompleteSelectedEvent): void {
		this.updateFilters.emit([...this.category_filters, event.option.viewValue as SettingsCategory]);
		this.new_category_control.setValue('');
		event.option.deselect();
		setTimeout(() => {
			this.init();
		});
	}
}
