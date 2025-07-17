/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
/* Vendor Dependencies */
import { MatSelectChange } from '@angular/material/select';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { DateTime } from 'luxon';
/* Application Dependencies */
import { NonNullableMintKeysetsSettings } from '@client/modules/settings/types/setting.types';
/* Native Dependencies */
import { MintKeyset } from '@client/modules/mint/classes/mint-keyset.class';
/* Shared Dependencies */
import { MintUnit } from '@shared/generated.types';

type UnitOption = {
	label: string;
	value: MintUnit;
}
type StatusOption = {
	label: string;
	value: boolean;
}

@Component({
	selector: 'orc-mint-keyset-control',
	standalone: false,
	templateUrl: './mint-keyset-control.component.html',
	styleUrl: './mint-keyset-control.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	// prettier-ignore
	animations: [
		trigger('formStateReaction', [
			state('valid', style({
				height: '52px',
				overflow: 'hidden',
			})),
			state('invalid', style({
				height: '71px',
				overflow: 'hidden',
			})),
			transition('valid <=> invalid', [
				animate('300ms ease-in-out'),
			]),
		]),
	],
})
export class MintKeysetControlComponent implements OnChanges {

	@Input() page_settings!: NonNullableMintKeysetsSettings;
	@Input() date_start?: number;
	@Input() date_end?: number;
	@Input() units?: MintUnit[];
	@Input() status?: boolean[];
	@Input() keysets!: MintKeyset[];
	@Input() loading!: boolean;
	@Input() mint_genesis_time!: number;

	@Output() dateChange = new EventEmitter<number[]>();
	@Output() unitsChange = new EventEmitter<MintUnit[]>();
	@Output() statusChange = new EventEmitter<boolean[]>();

	public readonly panel = new FormGroup({
		daterange: new FormGroup({
			date_start: new FormControl<DateTime | null>(null, [Validators.required]),
			date_end: new FormControl<DateTime | null>(null, [Validators.required]),
		}),
		units: new FormControl<MintUnit[] | null>(null, [Validators.required]),
		status: new FormControl<boolean[] | null>(null, [Validators.required]),
	});

	public unit_options!: UnitOption[];
	public status_options: StatusOption[] = [
		{ label: 'Active', value: true },
		{ label: 'Inactive', value: false },
	];
	public get height_state(): string {
		return this.panel?.invalid ? 'invalid' : 'valid';
	}

	constructor() {}

	ngOnChanges(changes: SimpleChanges): void {
		if(changes['loading'] && !this.loading) this.initForm();
		if(changes['date_start'] && this.date_start && this.panel.controls.daterange.get('date_start')?.value?.toSeconds() !== this.date_start) {
			this.panel.controls.daterange.get('date_start')?.setValue(DateTime.fromSeconds(this.date_start));
		}
		if(changes['date_end'] && this.date_end && this.panel.controls.daterange.get('date_end')?.value?.toSeconds() !== this.date_end) {
			this.panel.controls.daterange.get('date_end')?.setValue(DateTime.fromSeconds(this.date_end));
		}
		if(changes['units'] && this.units && this.panel.controls.units.value !== this.units) {
			this.panel.controls.units.setValue(this.units);
		}
		if(changes['status'] && this.status && this.panel.controls.status.value !== this.status) {
			this.panel.controls.status.setValue(this.status);
		}
	}

	private initForm(): void {
		const unique_units = Array.from(new Set(this.keysets.map(keyset => keyset.unit)));
		this.unit_options = unique_units.map(unit => ({ label: unit.toUpperCase(), value: unit }));
		this.panel.controls.daterange.controls.date_start.setValue(DateTime.fromSeconds(this.page_settings.date_start));
		this.panel.controls.daterange.controls.date_end.setValue(DateTime.fromSeconds(this.page_settings.date_end));
		this.panel.controls.units.setValue(this.page_settings.units);
	}

	public onDateChange(): void {
		if(this.panel.invalid) return;
		const is_valid = this.isValidChange();
		if( !is_valid ) return;
		if( this.panel.controls.daterange.controls.date_start.value === null ) return;
		if( this.panel.controls.daterange.controls.date_end.value === null ) return;
		const date_start = Math.floor(this.panel.controls.daterange.controls.date_start.value.toSeconds());
		const date_end = Math.floor(this.panel.controls.daterange.controls.date_end.value.endOf('day').toSeconds());
		this.dateChange.emit([date_start, date_end]);
	}

	public onUnitsChange(event: MatSelectChange): void {
		if(this.panel.invalid) return;
		const is_valid = this.isValidChange();
		if( !is_valid ) return;
		this.unitsChange.emit(event.value);
	}

	public onStatusChange(event: MatSelectChange): void {
		if(this.panel.invalid) return;
		const is_valid = this.isValidChange();
		if( !is_valid ) return;
		this.statusChange.emit(event.value);
	}

	public genesis_class: MatCalendarCellClassFunction<DateTime> = (cellDate, view) => {
		if( view !== 'month' ) return '';
		const unix_seconds = cellDate.toSeconds();
		const unix_next_day = unix_seconds + 86400 - 1;
		if( unix_seconds <= this.mint_genesis_time && unix_next_day >= this.mint_genesis_time ) return 'mint-genesis-date-class';
		return '';
	};

	private isValidChange(): boolean {
		// validations
		if( this.panel.controls.daterange.controls.date_start.value === null ) return false;
		if( this.panel.controls.daterange.controls.date_end.value === null ) return false;
		if( this.panel.controls.units.value === null ) return false;
		if( this.panel.controls.status.value === null ) return false;
		// change checks
		if( this.panel.controls.daterange.controls.date_start.value.toSeconds() !== this.page_settings.date_start ) return true;
		if( this.panel.controls.daterange.controls.date_end.value.toSeconds() !== this.page_settings.date_end ) return true;
		if( this.panel.controls.units.value !== this.page_settings.units ) return true;
		if( this.panel.controls.status.value !== this.page_settings.status ) return true;
		return false;
	}
}
