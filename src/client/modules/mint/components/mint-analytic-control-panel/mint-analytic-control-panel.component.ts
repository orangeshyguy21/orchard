/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
/* Vendor Dependencies */
import { MatSelectChange } from '@angular/material/select';
import { DateTime } from 'luxon';
/* Application Dependencies */
import { NonNullableMintChartSettings } from '@client/modules/chart/services/chart/chart.types';
/* Native Dependencies */
import { MintKeyset } from '@client/modules/mint/classes/mint-keyset.class';
import { ChartType } from '@client/modules/mint/enums/chart-type.enum';
/* Shared Dependencies */
import { MintAnalyticsInterval, MintUnit } from '@shared/generated.types';
import { trigger, state, style, transition, animate } from '@angular/animations';

type UnitOption = {
	label: string;
	value: MintUnit;
}
type IntervalOption = {
	label: string;
	value: MintAnalyticsInterval;
}
type TypeOption = {
	label: string;
	value: ChartType;
}

@Component({
	selector: 'orc-mint-analytic-control-panel',
	standalone: false,
	templateUrl: './mint-analytic-control-panel.component.html',
	styleUrl: './mint-analytic-control-panel.component.scss',
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
export class MintAnalyticControlPanelComponent implements OnChanges {
	
	@Input() chart_settings!: NonNullableMintChartSettings;
	@Input() keysets!: MintKeyset[]; // gotta make the options from the keysets
	@Input() loading!: boolean;

	@Output() date_change = new EventEmitter<number[]>();
	@Output() units_change = new EventEmitter<MintUnit[]>();
	@Output() interval_change = new EventEmitter<MintAnalyticsInterval>();
	@Output() type_change = new EventEmitter<ChartType>();

	public readonly panel = new FormGroup({
		daterange: new FormGroup({
			date_start: new FormControl<DateTime | null>(null, [Validators.required]),
			date_end: new FormControl<DateTime | null>(null, [Validators.required]),
		}),
		units: new FormControl<MintUnit[] | null>(null, [Validators.required]),
		interval: new FormControl<MintAnalyticsInterval | null>(null, [Validators.required]),
		type: new FormControl<ChartType | null>(null, [Validators.required]),
	});

	public unit_options!: UnitOption[]; 
	public interval_options: IntervalOption[] = [
		{ label: 'Day', value: MintAnalyticsInterval.Day },
		{ label: 'Week', value: MintAnalyticsInterval.Week },
		{ label: 'Month', value: MintAnalyticsInterval.Month },
	];
	public type_options: TypeOption[] = [
		{ label: 'Summary', value: ChartType.Summary },
		{ label: 'Operations', value: ChartType.Operations },
		{ label: 'Volume', value: ChartType.Volume },
	];

	public get height_state(): string {
		return this.panel?.invalid ? 'invalid' : 'valid';
	}

	constructor() {}

	ngOnChanges(changes: SimpleChanges): void {			
		if(changes['loading'] && !this.loading) this.initForm();
	}

	private initForm(): void {
		this.unit_options = this.keysets.map( keyset => ({ label: keyset.unit.toUpperCase(), value: keyset.unit }));
		this.panel.controls.daterange.controls.date_start.setValue(DateTime.fromSeconds(this.chart_settings.date_start));
		this.panel.controls.daterange.controls.date_end.setValue(DateTime.fromSeconds(this.chart_settings.date_end));
		this.panel.controls.units.setValue(this.chart_settings.units);
		this.panel.controls.interval.setValue(this.chart_settings.interval);
		this.panel.controls.type.setValue(this.chart_settings.type);
	}

	public onDateChange(): void {
		if(this.panel.invalid) return;
		const is_valid = this.isValidChange();
		if( !is_valid ) return;
		if( this.panel.controls.daterange.controls.date_start.value === null ) return;
		if( this.panel.controls.daterange.controls.date_end.value === null ) return;
		const date_start = this.panel.controls.daterange.controls.date_start.value.toSeconds();
		const date_end = this.panel.controls.daterange.controls.date_end.value.endOf('day').toSeconds();
		this.date_change.emit([date_start, date_end]);
	}

	public onUnitsChange(event: MatSelectChange): void {
		if(this.panel.invalid) return;
		const is_valid = this.isValidChange();
		if( !is_valid ) return;
		this.units_change.emit(event.value);
	}

	public onIntervalChange(event: MatSelectChange): void {
		if(this.panel.invalid) return;
		const is_valid = this.isValidChange();
		if( !is_valid ) return;
		this.interval_change.emit(event.value);
	}

	public onTypeChange(event: MatSelectChange): void {
		if(this.panel.invalid) return;
		const is_valid = this.isValidChange();
		if( !is_valid ) return;
		this.type_change.emit(event.value);
	}

	private isValidChange(): boolean {
		// validations
		if( this.panel.controls.daterange.controls.date_start.value === null ) return false;
		if( this.panel.controls.daterange.controls.date_end.value === null ) return false;
		if( this.panel.controls.units.value === null ) return false;
		if( this.panel.controls.interval.value === null ) return false;
		if( this.panel.controls.type.value === null ) return false;
		// change checks
		if( this.panel.controls.daterange.controls.date_start.value.toSeconds() !== this.chart_settings.date_start ) return true;
		if( this.panel.controls.daterange.controls.date_end.value.toSeconds() !== this.chart_settings.date_end ) return true;
		if( this.panel.controls.units.value !== this.chart_settings.units ) return true;
		if( this.panel.controls.interval.value !== this.chart_settings.interval ) return true;
		if( this.panel.controls.type.value !== this.chart_settings.type ) return true;
		return false;
	}
}