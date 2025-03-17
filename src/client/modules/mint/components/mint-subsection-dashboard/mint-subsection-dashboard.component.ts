/* Core Dependencies */
import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
/* Vendor Dependencies */
import { forkJoin, lastValueFrom } from 'rxjs';
import { DateTime } from 'luxon';
/* Application Dependencies */
import { CacheService } from '@client/modules/cache/services/cache/cache.service';
import { SettingService } from '@client/modules/settings/services/setting/setting.service';
import { ChartService } from '@client/modules/chart/services/chart/chart.service';
import { NonNullableMintChartSettings } from '@client/modules/chart/services/chart/chart.types';
/* Native Dependencies */
import { MintService } from '@client/modules/mint/services/mint/mint.service';
import { MintBalance } from '@client/modules/mint/classes/mint-balance.class';
import { MintKeyset } from '@client/modules/mint/classes/mint-keyset.class';
import { MintInfo } from '@client/modules/mint/classes/mint-info.class';
import { MintAnalytic } from '@client/modules/mint/classes/mint-analytic.class';
import { ChartType } from '@client/modules/mint/enums/chart-type.enum';
/* Shared Dependencies */
import { MintAnalyticsInterval, MintUnit } from '@shared/generated.types';

@Component({
	selector: 'orc-mint-subsection-dashboard',
	standalone: false,
	templateUrl: './mint-subsection-dashboard.component.html',
	styleUrl: './mint-subsection-dashboard.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintSubsectionDashboardComponent implements OnInit {

	// data
	public mint_info: MintInfo | null = null;
	public mint_balances: MintBalance[] = [];
	public mint_keysets: MintKeyset[] = [];
	public mint_analytics_balances: MintAnalytic[] = [];
	public mint_analytics_balances_preceeding: MintAnalytic[] = [];
	public locale!: string;
	// derived data
	public mint_genesis_time: number = 0;
	// state
	public loading_static_data: boolean = true;
	public loading_dynamic_data: boolean = true;
	// chart settings
	public chart_settings!: NonNullableMintChartSettings;

	constructor(
		private mintService: MintService,
		private cacheService: CacheService,
		private settingService: SettingService,
		private chartService: ChartService,
		private changeDetectorRef: ChangeDetectorRef
	) {}

	async ngOnInit(): Promise<void> {
		try {
			await this.loadStaticData();
			this.locale = await this.settingService.getLocale();
			this.mint_genesis_time = this.getMintGenesisTime();
			this.chart_settings = this.getChartSettings();
			this.loading_static_data = false;
			this.changeDetectorRef.detectChanges();
			await this.loadMintAnalyticsBalances();
			this.loading_dynamic_data = false;
			this.changeDetectorRef.detectChanges();
		} catch (error) {
			console.error('Error in initialization sequence:', error);
		}
	}

	private async loadStaticData(): Promise<void> {
		const info_obs = this.mintService.loadMintInfo();
		const balances_obs = this.mintService.loadMintBalances();
		const keysets_obs = this.mintService.loadMintKeysets();

		const [info, balances, keysets] = await lastValueFrom(
			forkJoin([info_obs, balances_obs, keysets_obs])
		);
		
		this.mint_info = info;
		this.mint_balances = balances;
		this.mint_keysets = keysets;
	}

	private async loadMintAnalyticsBalances(): Promise<void> {
		const timezone = this.settingService.getTimezone();
		const analytics_balances_obs = this.mintService.loadMintAnalyticsBalances({
			units: this.chart_settings.units,
			date_start: this.chart_settings.date_start,
			date_end: this.chart_settings.date_end,
			interval: this.chart_settings.interval,
			timezone: timezone
		});
		const preceeding_sums_obs = this.mintService.loadMintAnalyticsBalances({
			units: this.chart_settings.units,
			date_start: 100000,
			date_end: this.chart_settings.date_start-1,
			interval: MintAnalyticsInterval.Custom,
			timezone: timezone
		});
		const [analytics_balances, preceeding_sums] = await lastValueFrom(
			forkJoin([analytics_balances_obs, preceeding_sums_obs])
		);
		this.mint_analytics_balances = analytics_balances;
		this.mint_analytics_balances_preceeding = preceeding_sums;
	}

	private getChartSettings(): NonNullableMintChartSettings {
		const settings = this.chartService.getMintChartSettings();
		return {
			type: settings.type ?? ChartType.Summary,
			interval: settings.interval ?? MintAnalyticsInterval.Day,
			units: settings.units ?? this.getSelectedUnits(), // @todo there will be bugs here if a unit is not in the keysets (audit active keysets)
			date_start: settings.date_start ?? this.getSelectedDateStart(),
			date_end: settings.date_end ?? this.getSelectedDateEnd()
		};
	}

	private getSelectedUnits(): MintUnit[] {
		return this.mint_keysets.map(keyset => keyset.unit);
	}

	private getSelectedDateStart(): number {
		const three_months_ago = DateTime.now().minus({ months: 3 }).startOf('day');
		const three_months_ago_timestamp = Math.floor(three_months_ago.toSeconds());
		return Math.max(three_months_ago_timestamp, this.mint_genesis_time);
	}

	private getSelectedDateEnd(): number {
		const today = DateTime.now().endOf('day');
		return Math.floor(today.toSeconds());
	}

	private getMintGenesisTime(): number {
		if (!this.mint_keysets || this.mint_keysets.length === 0) return 0;
		return this.mint_keysets.reduce((oldest_time, keyset) => {
			return keyset.first_seen < oldest_time || oldest_time === 0 
				? keyset.first_seen 
				: oldest_time;
		}, 0);
	}

	private async reloadDynamicData(): Promise<void> {
		try {
			const cache_key = this.mintService.CACHE_KEYS.MINT_ANALYTICS_BALANCES;
			const cache_key_preceeding = this.mintService.CACHE_KEYS.MINT_ANALYTICS_PRE_BALANCES;
			this.cacheService.clearCache(cache_key);
			this.cacheService.clearCache(cache_key_preceeding);
			this.loading_dynamic_data = true;
			this.changeDetectorRef.detectChanges();
			await this.loadMintAnalyticsBalances();
			this.loading_dynamic_data = false;
			this.changeDetectorRef.detectChanges();
		} catch (error) {
			console.error('Error updating dynamic data:', error);
		}
	}

	public onDateChange(event: number[]): void {
		this.chart_settings.date_start = event[0];
		this.chart_settings.date_end = event[1];
		this.chartService.setMintChartShortSettings(this.chart_settings);
		this.reloadDynamicData();
	}

	public onUnitsChange(event: MintUnit[]): void {
		this.chart_settings.units = event;
		this.chartService.setMintChartSettings(this.chart_settings);
		this.reloadDynamicData();
	}

	public onIntervalChange(event: MintAnalyticsInterval): void {
		this.chart_settings.interval = event;
		this.chartService.setMintChartSettings(this.chart_settings);
		this.reloadDynamicData();
	}

	public onTypeChange(event: ChartType): void {
		this.chart_settings.type = event;
		this.chartService.setMintChartSettings(this.chart_settings);
		this.reloadDynamicData();
	}
}

