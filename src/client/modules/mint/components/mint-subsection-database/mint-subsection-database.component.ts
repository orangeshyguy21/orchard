/* Core Dependencies */
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
/* Vendor Dependencies */
import { DateTime } from 'luxon';
import { lastValueFrom, Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
/* Application Configuration */
import { environment } from '@client/configs/configuration';
/* Application Dependencies */
import { NonNullableMintDatabaseSettings } from '@client/modules/settings/types/setting.types';
import { SettingService } from '@client/modules/settings/services/setting/setting.service';
import { EventService } from '@client/modules/event/services/event/event.service';
import { EventData } from '@client/modules/event/classes/event-data.class';
import { DataType } from '@client/modules/orchard/enums/data.enum';
import { ComponentCanDeactivate } from '@client/modules/routing/interfaces/routing.interfaces';
/* Native Dependencies */
import { MintService } from '@client/modules/mint/services/mint/mint.service';
import { MintKeyset } from '@client/modules/mint/classes/mint-keyset.class';
import { MintMintQuote } from '@client/modules/mint/classes/mint-mint-quote.class';
import { MintMeltQuote } from '@client/modules/mint/classes/mint-melt-quote.class';
/* Shared Dependencies */
import { MintUnit, MintQuoteState, MeltQuoteState } from '@shared/generated.types';

export type MintData = MintMintData | MintMeltData;
type MintMintData = {
	type : DataType.MintMints;
	source : MatTableDataSource<MintMintQuote>;
}
type MintMeltData = {
	type : DataType.MintMelts;
	source : MatTableDataSource<MintMeltQuote>;
}

const PAGE_SIZE = 100;

@Component({
	selector: 'orc-mint-subsection-database',
	standalone: false,
	templateUrl: './mint-subsection-database.component.html',
	styleUrl: './mint-subsection-database.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('slideInOut', [
			state('closed', style({
				height: '0',
				opacity: '0'
			})),
			state('open', style({
				height: '*',
				opacity: '1'
			})),
			transition('closed => open', [
				style({ overflow: 'hidden' }),
				animate('200ms ease-out')
			]),
			transition('open => closed', [
				style({ overflow: 'hidden' }),
				animate('200ms ease-out')
			])
		])
	]
})
export class MintSubsectionDatabaseComponent implements ComponentCanDeactivate, OnInit {

	@HostListener('window:beforeunload')
	canDeactivate(): boolean {
		return this.active_event?.type !== 'PENDING';
	}

	public page_settings!: NonNullableMintDatabaseSettings;
	public filter: string = '';
	public locale!: string;
	public mint_genesis_time: number = 0;
	public loading_static_data: boolean = true;
	public loading_dynamic_data: boolean = true;
	public data!: MintData;
	public count: number = 0;
	public mint_keysets: MintKeyset[] = [];
	public backup_create: boolean = false;

	private active_event: EventData | null = null;
	private subscriptions: Subscription = new Subscription();

	public get page_size(): number {
		return this.data?.source?.data?.length ?? 0;
	}

	constructor(
		private route: ActivatedRoute,
		private settingService: SettingService,
		private eventService: EventService,
		private mintService: MintService,
		private cdr: ChangeDetectorRef,
	) {}

	// ngOnInit(): void {		
	// 	this.mint_keysets = this.route.snapshot.data['mint_keysets'];
	// 	this.unit_options = this.getUnitOptions();
	// 	this.resetForm();
	// 	this.initKeysetsAnalytics();
	// 	this.subscriptions.add(this.getEventSubscription());
	// 	this.orchardOptionalInit();
	// }

	ngOnInit(): void {
		this.mint_keysets = this.route.snapshot.data['mint_keysets'];
		this.resetForm();
		this.initData();
		this.subscriptions.add(this.getEventSubscription());
		this.orchardOptionalInit();
	}


	orchardOptionalInit(): void {
		if( environment.ai.enabled ) {
			// this.subscriptions.add(this.getAgentSubscription());
			// this.subscriptions.add(this.getToolSubscription());
		}
	}

	private resetForm(): void {
		// todo
		// this.form_keyset.markAsPristine();
		// const default_unit = this.getDefaultUnit();
		// const default_input_fee_ppk = this.getDefaultInputFeePpk(default_unit);
		// const default_max_order = 32;
		// this.keyset_out = this.getKeysetOut(default_unit);
		// this.form_keyset.patchValue({
		// 	unit: default_unit,
		// 	input_fee_ppk: default_input_fee_ppk,
		// 	max_order: default_max_order,
		// });
	}


	private getEventSubscription(): Subscription {
		return this.eventService.getActiveEvent().subscribe((event_data: EventData | null) => {
			this.active_event = event_data;
			if( event_data === null && this.backup_create ){
				this.eventService.registerEvent(new EventData({
					type: 'PENDING',
					message: 'Create Backup',
				}));
			}
			if( event_data ){
				if( event_data.type === 'SUCCESS' ) this.onSuccessEvent();
				if( event_data.confirmed !== null )( event_data.confirmed ) ? this.onCreateConfirmed() : this.onCreateClose();
			}
		});
	}

	private async initData(): Promise<void> {
		this.locale = this.settingService.getLocale();
		this.mint_genesis_time = this.getMintGenesisTime();
		this.page_settings = this.getPageSettings();
		const timezone = this.settingService.getTimezone();
		this.loading_static_data = false;
		this.cdr.detectChanges();
		await this.getDynamicData(timezone);
		this.loading_dynamic_data = false;
		this.cdr.detectChanges();
	}

	private getMintGenesisTime(): number {
		if (!this.mint_keysets || this.mint_keysets.length === 0) return 0;
		return this.mint_keysets.reduce((oldest_time, keyset) => {
			return keyset.valid_from < oldest_time || oldest_time === 0 
				? keyset.valid_from 
				: oldest_time;
		}, 0);
	}

	private getPageSettings(): NonNullableMintDatabaseSettings {
		const settings = this.settingService.getMintDatabaseSettings();
		const type = settings.type ?? DataType.MintMints;
		return {
			type: type,
			date_start: settings.date_start ?? this.mint_genesis_time,
			date_end: settings.date_end ?? this.getSelectedDateEnd(),
			page: settings.page ?? 1,
			units: settings.units ?? this.getSelectedUnits(),
			states: settings.states ?? this.getSelectedStates(type)
		};
	}

	private getSelectedDateEnd(): number {
		const today = DateTime.now().endOf('day');
		return Math.floor(today.toSeconds());
	}

	private getSelectedUnits(): MintUnit[] {
		return Array.from(new Set(this.mint_keysets.map(keyset => keyset.unit)));
	}

	private getSelectedStates(type: DataType): string[] {
		if( type === DataType.MintMints ) return Object.values(MintQuoteState);
		if( type === DataType.MintMelts ) return Object.values(MeltQuoteState);
		return [];
	}

	private async getDynamicData(timezone: string): Promise<void> {
		if( this.page_settings.type === DataType.MintMints ) return this.getMintsData(timezone);
		if( this.page_settings.type === DataType.MintMelts ) return this.getMeltsData(timezone);
	}

	private async getMintsData(timezone: string): Promise<void> {
		const mint_mint_quotes_data = await lastValueFrom(
			this.mintService.getMintMintQuotesData({
				date_start: this.page_settings.date_start,
				date_end: this.page_settings.date_end,
				units: this.page_settings.units,
				states: (this.page_settings.states as MintQuoteState[]),
				timezone: timezone,
				page: this.page_settings.page,
				page_size: PAGE_SIZE,
			})
		);
		this.data = {
			type: DataType.MintMints,
			source: new MatTableDataSource(mint_mint_quotes_data.mint_mint_quotes)
		};
		this.count = mint_mint_quotes_data.count;
	}

	private async getMeltsData(timezone: string): Promise<void> {
		const mint_melt_quotes_data = await lastValueFrom(
			this.mintService.getMintMeltQuotesData({
				date_start: this.page_settings.date_start,
				date_end: this.page_settings.date_end,
				units: this.page_settings.units,
				states: (this.page_settings.states as MeltQuoteState[]),
				timezone: timezone,
				page: this.page_settings.page,
				page_size: PAGE_SIZE,
			})
		);
		this.data = {
			type: DataType.MintMelts,
			source: new MatTableDataSource(mint_melt_quotes_data.mint_melt_quotes)
		};
		this.count = mint_melt_quotes_data.count;
	}

	private async reloadDynamicData(): Promise<void> {
		try {
			this.loading_dynamic_data = true;
			const timezone = this.settingService.getTimezone();
			this.cdr.detectChanges();
			await this.getDynamicData(timezone);
			this.loading_dynamic_data = false;
			this.cdr.detectChanges();
		} catch (error) {
			console.error('Error updating dynamic data:', error);
		}
	}

	public onDateChange(event: number[]): void {
		this.page_settings.date_start = event[0];
		this.page_settings.date_end = event[1];
		this.settingService.setMintDatabaseShortSettings(this.page_settings);
		this.reloadDynamicData();
	}

	public onTypeChange(event: DataType): void {
		this.page_settings.type = event;
		this.page_settings.states = this.getSelectedStates(event);
		this.settingService.setMintDatabaseSettings(this.page_settings);
		this.reloadDynamicData();
	}

	public onUnitsChange(event: MintUnit[]): void {
		this.page_settings.units = event;
		this.settingService.setMintDatabaseSettings(this.page_settings);
		this.reloadDynamicData();
	}

	public onStatesChange(event: string[]): void {
		this.page_settings.states = event;
		this.settingService.setMintDatabaseSettings(this.page_settings);
		this.reloadDynamicData();
	}

	public onPage(event: PageEvent): void {
		this.page_settings.page = event.pageIndex + 1;	
		this.settingService.setMintDatabaseShortSettings(this.page_settings);
		this.reloadDynamicData();
	}

	public onFilterChange(event: Event): void {
		this.filter = (event.target as HTMLInputElement).value;
		this.data.source.filter = this.filter.trim().toLowerCase();
		this.cdr.detectChanges();
	}

	public onCreate(): void {
		( !this.backup_create ) ? this.initCreateBackup() : this.onCreateClose();
	}

	private initCreateBackup(): void {
		this.backup_create = true;
		this.eventService.registerEvent(new EventData({
			type: 'PENDING',
			message: 'Save',
		}));
	}

	public onCreateClose(): void {
		this.backup_create = false;
		this.eventService.registerEvent(null);
		this.cdr.detectChanges();
	}	

	private onCreateConfirmed(): void {
		this.mintService.createMintDatabaseBackup().subscribe({
			next: (response) => {
				const { filebase64 } = response.mint_database_backup;
				const decoded_data = atob(filebase64);
				const filename = `MintDatabaseBackup-${DateTime.now().toFormat('yyyyMMdd-HHmmss')}.db`;
				const uint8_array = Uint8Array.from(decoded_data, c => c.charCodeAt(0));
				const file = new File([uint8_array], filename, { type: 'application/octet-stream' });
				const url = URL.createObjectURL(file);
				const a = document.createElement('a');
				a.href = url;
				a.download = filename;
				a.click();
				this.eventService.registerEvent(new EventData({
					type: 'SUCCESS',
					message: 'Backup created!',
				}));
			},
			error: (error) => {
				this.eventService.registerEvent(new EventData({
					type: 'ERROR',
					message: error
				}));
			}
		});
	}


	private onSuccessEvent(): void {
		// todo try to download the file here instead for timing reasons?
		this.backup_create = false;
		this.cdr.detectChanges();
	}
}