/* Core Dependencies */
import {ChangeDetectionStrategy, Component, effect, input, output, signal, untracked, viewChild} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
/* Vendor Dependencies */
import {DateTime} from 'luxon';
import {MatCalendarCellClassFunction} from '@angular/material/datepicker';
import {MatSelectChange} from '@angular/material/select';
import {MatMenuTrigger} from '@angular/material/menu';
/* Application Dependencies */
import {NonNullableMintDatabaseSettings} from '@client/modules/settings/types/setting.types';
import {MintDataType} from '@client/modules/mint/enums/data-type.enum';
import {MintKeyset} from '@client/modules/mint/classes/mint-keyset.class';
/* Shared Dependencies */
import {MintUnit} from '@shared/generated.types';

type TypeOption = {
	label: string;
	value: MintDataType;
	helper?: string;
};

@Component({
	selector: 'orc-mint-subsection-database-control',
	standalone: false,
	templateUrl: './mint-subsection-database-control.component.html',
	styleUrl: './mint-subsection-database-control.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionDatabaseControlComponent {
	/* Inputs */
	public readonly page_settings = input.required<NonNullableMintDatabaseSettings>();
	public readonly filter = input<string>('');
	public readonly unit_options = input.required<{value: string; label: string}[]>();
	public readonly state_options = input.required<string[]>();
	public readonly state_enabled = input.required<boolean>();
	public readonly date_start = input<number>();
	public readonly date_end = input<number>();
	public readonly type = input<MintDataType>();
	public readonly states = input<string[]>();
	public readonly units = input<MintUnit[]>();
	public readonly loading = input.required<boolean>();
	public readonly mint_genesis_time = input.required<number>();
	public readonly keysets = input.required<MintKeyset[]>();

	/* Outputs */
	public readonly dateChange = output<number[]>();
	public readonly typeChange = output<MintDataType>();
	public readonly unitsChange = output<MintUnit[]>();
	public readonly statesChange = output<string[]>();
	public readonly filterChange = output<Event>();

	private readonly filter_menu_trigger = viewChild(MatMenuTrigger);

	/* Form */
	public readonly panel = new FormGroup({
		type: new FormControl<MintDataType | null>(null, [Validators.required]),
		daterange: new FormGroup({
			date_start: new FormControl<DateTime | null>(null, [Validators.required]),
			date_end: new FormControl<DateTime | null>(null, [Validators.required]),
		}),
		units: new FormControl<MintUnit[] | null>(null, [Validators.required]),
		states: new FormControl<string[] | null>(null, [Validators.required]),
		filter: new FormControl<string>(''),
	});

	/* State */
	public type_options = signal<TypeOption[]>([]);
	public filter_count = signal(0);

	public get height_state(): string {
		return this.panel?.invalid ? 'invalid' : 'valid';
	}

	constructor() {
		this.panel
			.get('daterange')
			?.statusChanges.pipe(takeUntilDestroyed())
			.subscribe(() => {
				const group = this.panel.get('daterange');
				group?.markAllAsTouched();
			});

		/* Effect: Initialize form when loading completes */
		effect(() => {
			if (this.loading() !== false) return;
			untracked(() => this.initForm());
		});

		/* Effect: Sync state_enabled input to form */
		effect(() => {
			const enabled = this.state_enabled();
			enabled ? this.panel.controls.states.enable() : this.panel.controls.states.disable();
		});

		/* Effect: Sync date_start input to form */
		effect(() => {
			const date_start = this.date_start();
			if (!date_start) return;
			if (this.panel.controls.daterange.controls.date_start.value?.toSeconds() === date_start) return;
			this.panel.controls.daterange.controls.date_start.setValue(DateTime.fromSeconds(date_start));
		});

		/* Effect: Sync date_end input to form */
		effect(() => {
			const date_end = this.date_end();
			if (!date_end) return;
			if (this.panel.controls.daterange.controls.date_end.value?.toSeconds() === date_end) return;
			this.panel.controls.daterange.controls.date_end.setValue(DateTime.fromSeconds(date_end));
		});

		/* Effect: Sync type input to form */
		effect(() => {
			const type = this.type();
			if (!type) return;
			if (this.panel.controls.type.value === type) return;
			this.panel.controls.type.setValue(type);
		});

		/* Effect: Sync units input to form */
		effect(() => {
			const units = this.units();
			if (!units) return;
			if (this.panel.controls.units.value === units) return;
			this.panel.controls.units.setValue(units);
		});

		/* Effect: Sync states input to form */
		effect(() => {
			const states = this.states();
			if (!states) return;
			if (this.panel.controls.states.value === states) return;
			this.panel.controls.states.setValue(states);
		});
	}

	private initForm(): void {
		const settings = this.page_settings();
		this.type_options.set(this.getTypeOptions());
		this.panel.controls.type.setValue(settings.type);
		this.panel.controls.daterange.controls.date_start.setValue(DateTime.fromSeconds(settings.date_start));
		this.panel.controls.daterange.controls.date_end.setValue(DateTime.fromSeconds(settings.date_end));
		this.panel.controls.units.setValue(settings.units);
		this.panel.controls.states.setValue(settings.states);
	}

	public onDateChange(): void {
		if (this.panel.invalid) return;
		const is_valid = this.isValidChange();
		if (!is_valid) return;
		if (this.panel.controls.daterange.controls.date_start.value === null) return;
		if (this.panel.controls.daterange.controls.date_end.value === null) return;
		const date_start = Math.floor(this.panel.controls.daterange.controls.date_start.value.toSeconds());
		const date_end = Math.floor(this.panel.controls.daterange.controls.date_end.value.endOf('day').toSeconds());
		this.dateChange.emit([date_start, date_end]);
	}

	public onTypeChange(event: MatSelectChange): void {
		if (this.panel.invalid) return;
		const is_valid = this.isValidChange();
		if (!is_valid) return;
		this.typeChange.emit(event.value);
	}

	public onUnitsChange(event: MatSelectChange): void {
		if (this.panel.invalid) return;
		const is_valid = this.isValidChange();
		if (!is_valid) return;
		this.unitsChange.emit(event.value);
	}

	public onStatesChange(event: MatSelectChange): void {
		if (this.panel.invalid) return;
		const is_valid = this.isValidChange();
		if (!is_valid) return;
		this.statesChange.emit(event.value);
	}

	public onClearFilter(): void {
		// this.panel.controls.units.setValue(null);
		// this.panel.controls.states.setValue(null);
		// this.filter_count.set(0);
	}

	public onCloseFilter(): void {
		this.filter_menu_trigger()?.closeMenu();
	}

	public genesisClass: MatCalendarCellClassFunction<DateTime> = (cellDate, view) => {
		if (view !== 'month') return '';
		const genesis_time = this.mint_genesis_time();
		const unix_seconds = cellDate.toSeconds();
		const unix_next_day = unix_seconds + 86400 - 1;
		if (unix_seconds <= genesis_time && unix_next_day >= genesis_time) return 'mint-genesis-date-class';
		return '';
	};

	public getSelectedTypeLabel(value: any): string {
		const selected_type = this.type_options().find((type) => type.value === value);
		return selected_type ? selected_type.label : '';
	}

	private getTypeOptions(): TypeOption[] {
		return Object.values(MintDataType).map((type) => ({
			label: this.getTypeLabel(type),
			helper: this.getTypeHelper(type),
			value: type,
		}));
	}
	private getTypeLabel(type: MintDataType): string {
		if (type === MintDataType.MintMints) return 'Mints';
		if (type === MintDataType.MintMelts) return 'Melts';
		if (type === MintDataType.MintProofGroups) return 'Ecash Used';
		if (type === MintDataType.MintPromiseGroups) return 'Ecash Issued';
		return 'Unknown';
	}
	private getTypeHelper(type: MintDataType): string {
		if (type === MintDataType.MintMints) return 'Mint deposits';
		if (type === MintDataType.MintMelts) return 'Mint withdrawals';
		if (type === MintDataType.MintProofGroups) return 'Ecash burned by the mint';
		if (type === MintDataType.MintPromiseGroups) return 'Ecash issued by the mint';
		return 'n/a';
	}

	private isValidChange(): boolean {
		const settings = this.page_settings();
		// validations
		if (this.panel.controls.type.value === null) return false;
		if (this.panel.controls.daterange.controls.date_start.value === null) return false;
		if (this.panel.controls.daterange.controls.date_end.value === null) return false;
		if (this.panel.controls.units.value === null) return false;
		if (this.panel.controls.states.value === null) return false;
		// change checks
		if (this.panel.controls.type.value !== settings.type) return true;
		if (this.panel.controls.daterange.controls.date_start.value.toSeconds() !== settings.date_start) return true;
		if (this.panel.controls.daterange.controls.date_end.value.toSeconds() !== settings.date_end) return true;
		if (this.panel.controls.units.value !== settings.units) return true;
		if (this.panel.controls.states.value !== settings.states) return true;
		return false;
	}
}
