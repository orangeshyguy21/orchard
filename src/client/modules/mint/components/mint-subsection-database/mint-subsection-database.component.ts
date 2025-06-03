/* Core Dependencies */
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
/* Vendor Dependencies */
import { DateTime } from 'luxon';
import { lastValueFrom } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
/* Application Dependencies */
import { NonNullableMintDatabaseSettings } from '@client/modules/settings/types/setting.types';
import { SettingService } from '@client/modules/settings/services/setting/setting.service';
import { DataType } from '@client/modules/orchard/enums/data.enum';
/* Native Dependencies */
import { MintService } from '@client/modules/mint/services/mint/mint.service';
import { MintKeyset } from '@client/modules/mint/classes/mint-keyset.class';
import { MintMintQuote } from '@client/modules/mint/classes/mint-mint-quote.class';
import { MintMeltQuote } from '@client/modules/mint/classes/mint-melt-quote.class';

export type MintData = MintMintData | MintMeltData;
type MintMintData = {
	type : DataType.MintMints;
	source : MatTableDataSource<MintMintQuote>;
}
type MintMeltData = {
	type : DataType.MintMelts;
	source : MatTableDataSource<MintMeltQuote>;
}

const PAGE_SIZE = 500;

@Component({
	selector: 'orc-mint-subsection-database',
	standalone: false,
	templateUrl: './mint-subsection-database.component.html',
	styleUrl: './mint-subsection-database.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintSubsectionDatabaseComponent implements OnInit {

	public page_settings!: NonNullableMintDatabaseSettings;
	public filter: string = '';
	public locale!: string;
	public mint_genesis_time: number = 0;
	public loading_static_data: boolean = true;
	public loading_dynamic_data: boolean = true;
	public data!: MintData;
	public count: number = 0;

	private mint_keysets: MintKeyset[] = [];

	constructor(
		private route: ActivatedRoute,
		private settingService: SettingService,
		private mintService: MintService,
		private cdr: ChangeDetectorRef,
	) {}

	ngOnInit(): void {
		this.mint_keysets = this.route.snapshot.data['mint_keysets'];
		this.initData();
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
		return {
			type: settings.type ?? DataType.MintMints,
			date_start: settings.date_start ?? this.mint_genesis_time,
			date_end: settings.date_end ?? this.getSelectedDateEnd(),
			page: settings.page ?? 1,
		};
	}

	private getSelectedDateEnd(): number {
		const today = DateTime.now().endOf('day');
		return Math.floor(today.toSeconds());
	}

	private async getDynamicData(timezone: string): Promise<void> {
		if( this.page_settings.type === DataType.MintMints ) return this.getMintsData(timezone);
		// if( this.chart_settings.type === MintDataType.Melts ) return this.getMeltsData(timezone);
	}

	private async getMintsData(timezone: string): Promise<void> {
		const mint_mint_quotes_data = await lastValueFrom(
			this.mintService.getMintMintQuotesData({
				date_start: this.page_settings.date_start,
				date_end: this.page_settings.date_end,
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
		console.log('onCreate');
	}

	public onRestore(): void {
		console.log('onRestore');
	}
}