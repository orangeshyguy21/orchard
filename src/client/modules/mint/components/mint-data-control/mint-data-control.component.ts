/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
/* Vendor Dependencies */
import { DateTime } from 'luxon';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { MatSelectChange } from '@angular/material/select';
/* Application Dependencies */
import { NonNullableMintDatabaseSettings } from '@client/modules/settings/types/setting.types';
import { DataType } from '@client/modules/orchard/enums/data.enum';
import { MintDataType } from '@client/modules/mint/enums/data-type.enum';
import { MintKeyset } from '@client/modules/mint/classes/mint-keyset.class';
/* Shared Dependencies */
import { MintUnit, MintQuoteState, MeltQuoteState } from '@shared/generated.types';

type UnitOption = {
	label: string;
	value: MintUnit;
}
type TypeOption = {
	label: string;
	value: MintDataType;
}

@Component({
	selector: 'orc-mint-data-control',
	standalone: false,
	templateUrl: './mint-data-control.component.html',
	styleUrl: './mint-data-control.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('formStateReaction', [
			state('valid', style({
				height: '52px',
				overflow: 'hidden'
			})),
			state('invalid', style({
				height: '71px',
				overflow: 'hidden'
			})),
			transition('valid <=> invalid', [
				animate('300ms ease-in-out')
			])
		])
	]
})
export class MintDataControlComponent implements OnChanges {

	@Input() page_settings!: NonNullableMintDatabaseSettings;
	@Input() filter!: string;
	@Input() date_start?: number;
	@Input() date_end?: number;
	@Input() states!: string[];
	@Input() loading!: boolean;
	@Input() mint_genesis_time!: number;
	@Input() keysets!: MintKeyset[];

	@Output() dateChange = new EventEmitter<number[]>();
	@Output() typeChange = new EventEmitter<DataType>();
	@Output() unitsChange = new EventEmitter<MintUnit[]>();
	@Output() statesChange = new EventEmitter<string[]>();
	@Output() filterChange = new EventEmitter<Event>();

	public readonly panel = new FormGroup({
		type: new FormControl<DataType | null>(null, [Validators.required]),
		daterange: new FormGroup({
			date_start: new FormControl<DateTime | null>(null, [Validators.required]),
			date_end: new FormControl<DateTime | null>(null, [Validators.required]),
		}),
		units: new FormControl<MintUnit[] | null>(null, [Validators.required]),
		states: new FormControl<string[] | null>(null, [Validators.required]),
		filter: new FormControl<string>(this.filter),
	});

	public type_options!: TypeOption[];
	public unit_options!: UnitOption[]; 
	public state_options!: string[];

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
		if(changes['states'] && this.states && this.panel.controls.states.value !== this.states) {
			this.state_options = (this.page_settings.type === DataType.MintMints) ? Object.values(MintQuoteState) : Object.values(MeltQuoteState);
			this.panel.controls.states.setValue(this.states);
		}
	}

	private initForm(): void {
		const unique_units = Array.from(new Set(this.keysets.map(keyset => keyset.unit)));
		this.unit_options = unique_units.map(unit => ({ label: unit.toUpperCase(), value: unit }));
		this.type_options = Object.values(MintDataType).map(type => ({ label: type.substring(4), value: type }));
		this.state_options = (this.page_settings.type === DataType.MintMints) ? Object.values(MintQuoteState) : Object.values(MeltQuoteState);
		this.panel.controls.type.setValue(this.page_settings.type);
		this.panel.controls.daterange.controls.date_start.setValue(DateTime.fromSeconds(this.page_settings.date_start));
		this.panel.controls.daterange.controls.date_end.setValue(DateTime.fromSeconds(this.page_settings.date_end));
		this.panel.controls.units.setValue(this.page_settings.units);
		this.panel.controls.states.setValue(this.page_settings.states);
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

	public onTypeChange(event: MatSelectChange): void {
		if(this.panel.invalid) return;
		const is_valid = this.isValidChange();
		if( !is_valid ) return;
		this.typeChange.emit(event.value);
	}

	public onUnitsChange(event: MatSelectChange): void {
		if(this.panel.invalid) return;
		const is_valid = this.isValidChange();
		if( !is_valid ) return;
		this.unitsChange.emit(event.value);
	}

	public onStatesChange(event: MatSelectChange): void {
		if(this.panel.invalid) return;
		const is_valid = this.isValidChange();
		if( !is_valid ) return;
		this.statesChange.emit(event.value);
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
		if( this.panel.controls.type.value === null ) return false;
		if( this.panel.controls.daterange.controls.date_start.value === null ) return false;
		if( this.panel.controls.daterange.controls.date_end.value === null ) return false;
		if( this.panel.controls.units.value === null ) return false;
		if( this.panel.controls.states.value === null ) return false;
		// change checks
		if( this.panel.controls.type.value !== this.page_settings.type ) return true;
		if( this.panel.controls.daterange.controls.date_start.value.toSeconds() !== this.page_settings.date_start ) return true;
		if( this.panel.controls.daterange.controls.date_end.value.toSeconds() !== this.page_settings.date_end ) return true;
		if( this.panel.controls.units.value !== this.page_settings.units ) return true;
		if( this.panel.controls.states.value !== this.page_settings.states ) return true;
		return false;
	}

}
