/* Core Dependencies */
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
/* Vendor Dependencies */
import { DateTime } from 'luxon';
import { lastValueFrom } from 'rxjs';
/* Application Dependencies */
import { NonNullableMintDatabaseSettings } from '@client/modules/chart/services/chart/chart.types';
import { SettingService } from '@client/modules/settings/services/setting/setting.service';
import { ChartService } from '@client/modules/chart/services/chart/chart.service';
import { MintDataType } from '@client/modules/mint/enums/chart-type.enum';
/* Native Dependencies */
import { MintService } from '@client/modules/mint/services/mint/mint.service';
import { MintKeyset } from '@client/modules/mint/classes/mint-keyset.class';
import { MintMintQuote } from '@client/modules/mint/classes/mint-mint-quote.class';
import { MintMeltQuote } from '@client/modules/mint/classes/mint-melt-quote.class';

type MintData = MintMintData | MintMeltData;
type MintMintData = {
	type : MintDataType.Mints;
	entities : MintMintQuote[];
}
type MintMeltData = {
	type : MintDataType.Melts;
	entities : MintMeltQuote[];
}

@Component({
	selector: 'orc-mint-subsection-database',
	standalone: false,
	templateUrl: './mint-subsection-database.component.html',
	styleUrl: './mint-subsection-database.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintSubsectionDatabaseComponent implements OnInit {

	public chart_settings!: NonNullableMintDatabaseSettings;
	public locale!: string;
	public mint_genesis_time: number = 0;
	public loading_static_data: boolean = true;
	public loading_dynamic_data: boolean = true;
	public data!: MintData;
	public count: number = 0;

	private mint_keysets: MintKeyset[] = [];
	private timezone: string = '';

	constructor(
		private route: ActivatedRoute,
		private settingService: SettingService,
		private chartService: ChartService,
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
		this.chart_settings = this.getChartSettings();
		this.timezone = this.settingService.getTimezone();
		this.loading_static_data = false;
		this.cdr.detectChanges();
		await this.getSelectedData();
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

	private getChartSettings(): NonNullableMintDatabaseSettings {
		const settings = this.chartService.getMintDatabaseSettings();
		return {
			date_start: settings.date_start ?? this.mint_genesis_time,
			date_end: settings.date_end ?? this.getSelectedDateEnd(),
			type: settings.type ?? MintDataType.Mints,
		};
	}

	private getSelectedDateEnd(): number {
		const today = DateTime.now().endOf('day');
		return Math.floor(today.toSeconds());
	}

	private async getSelectedData(): Promise<void> {
		if( this.chart_settings.type === MintDataType.Mints ) return this.getMintsData();
		// if( this.chart_settings.type === MintDataType.Melts ) return this.getMeltsData(timezone);
	}

	private async getMintsData(): Promise<void> {
		const mint_mint_quotes_data = await lastValueFrom(
			this.mintService.getMintMintQuotesData({
				date_start: this.chart_settings.date_start,
				date_end: this.chart_settings.date_end,
				timezone: this.timezone
			})
		);
		this.data = {
			type: MintDataType.Mints,
			entities: mint_mint_quotes_data.mint_mint_quotes
		};
		this.count = mint_mint_quotes_data.count;
	}

	public onDateChange(event: number[]): void {
		this.chart_settings.date_start = event[0];
		this.chart_settings.date_end = event[1];
		this.chartService.setMintDatabaseShortSettings(this.chart_settings);
		this.getSelectedData();
	}

	public onTypeChange(event: MintDataType): void {
		this.chart_settings.type = event;
		this.chartService.setMintDatabaseSettings(this.chart_settings);
		this.getSelectedData();
	}

	public onCreate(): void {
		console.log('onCreate');
	}

	public onRestore(): void {
		console.log('onRestore');
	}
}