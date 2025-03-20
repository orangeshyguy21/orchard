/* Core Dependencies */
import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
/* Vendor Dependencies */
import { forkJoin, lastValueFrom } from 'rxjs';
import { DateTime } from 'luxon';
/* Application Dependencies */
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
	public mint_analytics_balances_pre: MintAnalytic[] = [];
	public mint_analytics_mints: MintAnalytic[] = [];
	public mint_analytics_mints_pre: MintAnalytic[] = [];
	public mint_analytics_melts: MintAnalytic[] = [];
	public mint_analytics_melts_pre: MintAnalytic[] = [];
	public mint_analytics_transfers: MintAnalytic[] = [];
	public mint_analytics_transfers_pre: MintAnalytic[] = [];
	public locale!: string;
	// derived data
	public mint_genesis_time: number = 0;
	// state
	public loading_static_data: boolean = true;
	public loading_dynamic_data: boolean = true;
	// chart settings
	public chart_settings!: NonNullableMintChartSettings;

	public get active_keysets(): MintKeyset[] {
		return this.mint_keysets.filter(keyset => keyset.active);
	}

	constructor(
		private mintService: MintService,
		private settingService: SettingService,
		private chartService: ChartService,
		private changeDetectorRef: ChangeDetectorRef
	) {}

	async ngOnInit(): Promise<void> {
		await this.loadMintInfo(); // @todo do we need to wait for this to load balance sheet?
		await this.loadBalanceSheet(); // @todo same as above
		await this.initMintAnalytics();
	}

	private async loadMintInfo(): Promise<void> {
		try {
			this.mint_info = await lastValueFrom(this.mintService.loadMintInfo());
		} catch (error) {
			console.log('ERROR IN MINT INFO:', error);
			// look for a specific error, this would be like, api down or grpc unavailable
		}
	}
	private async loadBalanceSheet(): Promise<void> {
		try {
			const balances_obs = this.mintService.loadMintBalances();
			const keysets_obs = this.mintService.loadMintKeysets();
			const [balances, keysets] = await lastValueFrom(forkJoin([balances_obs, keysets_obs]));
			this.mint_balances = balances;
			this.mint_keysets = keysets;
		} catch (error) {
			console.log('ERROR IN LOAD BALANCE SHEET:', error);
			// we can watch for mintconnection errors - if that is the case
			/// shoot ^^ maybe we should load this data in the route resolver? - then we can catch errors and modify the view...
			/// we should consider this ^^ since its a litmas for if the mint is configured properly
			/// argument agaisnt is that this is more UI work and an operator could just look at the server logs
			// we can watch for mint select errors 
		}
	}
	private async initMintAnalytics(): Promise<void> {
		try {
			this.locale = await this.settingService.getLocale();
			this.mint_genesis_time = this.getMintGenesisTime();
			this.chart_settings = this.getChartSettings();
			this.loading_static_data = false;
			this.changeDetectorRef.detectChanges();
			await this.loadMintAnalytics();
			this.loading_dynamic_data = false;
			this.changeDetectorRef.detectChanges();
		} catch (error) {
			console.log('ERROR IN INIT MINT ANALYTICS:', error);
			// 
		}
	}

	private async loadMintAnalytics(): Promise<void> {
		const timezone = this.settingService.getTimezone();
		const analytics_balances_obs = this.mintService.loadMintAnalyticsBalances({
			units: this.chart_settings.units,
			date_start: this.chart_settings.date_start,
			date_end: this.chart_settings.date_end,
			interval: this.chart_settings.interval,
			timezone: timezone
		});
		const analytics_balances_pre_obs = this.mintService.loadMintAnalyticsBalances({
			units: this.chart_settings.units,
			date_start: 100000,
			date_end: this.chart_settings.date_start-1,
			interval: MintAnalyticsInterval.Custom,
			timezone: timezone
		});
		const analytics_mints_obs = this.mintService.loadMintAnalyticsMints({
			units: this.chart_settings.units,
			date_start: this.chart_settings.date_start,
			date_end: this.chart_settings.date_end,
			interval: this.chart_settings.interval,
			timezone: timezone
		});
		const analytics_mints_pre_obs = this.mintService.loadMintAnalyticsMints({
			units: this.chart_settings.units,
			date_start: 100000, // @todo make this bitcoin genesis time for the fans
			date_end: this.chart_settings.date_start-1,
			interval: MintAnalyticsInterval.Custom,
			timezone: timezone
		});
		const analytics_melts_obs = this.mintService.loadMintAnalyticsMelts({
			units: this.chart_settings.units,
			date_start: this.chart_settings.date_start,
			date_end: this.chart_settings.date_end,
			interval: this.chart_settings.interval,
			timezone: timezone
		});
		const analytics_melts_pre_obs = this.mintService.loadMintAnalyticsMelts({
			units: this.chart_settings.units,
			date_start: 100000,
			date_end: this.chart_settings.date_start-1,
			interval: MintAnalyticsInterval.Custom,
			timezone: timezone
		});
		const analytics_transfers_obs = this.mintService.loadMintAnalyticsTransfers({
			units: this.chart_settings.units,
			date_start: this.chart_settings.date_start,
			date_end: this.chart_settings.date_end,
			interval: this.chart_settings.interval,
			timezone: timezone
		});
		const analytics_transfers_pre_obs = this.mintService.loadMintAnalyticsTransfers({
			units: this.chart_settings.units,
			date_start: 100000,
			date_end: this.chart_settings.date_start-1,
			interval: MintAnalyticsInterval.Custom,
			timezone: timezone
		});
		const [
			analytics_balances, 
			analytics_balances_pre,
			analytics_mints,
			analytics_mints_pre,
			analytics_melts,
			analytics_melts_pre,
			analytics_transfers,
			analytics_transfers_pre,
		] = await lastValueFrom(
			forkJoin([
				analytics_balances_obs, 
				analytics_balances_pre_obs,
				analytics_mints_obs,
				analytics_mints_pre_obs,
				analytics_melts_obs,
				analytics_melts_pre_obs,
				analytics_transfers_obs,
				analytics_transfers_pre_obs,
			])
		);

		this.mint_analytics_balances = analytics_balances;
		this.mint_analytics_balances_pre = analytics_balances_pre;
		this.mint_analytics_mints = analytics_mints;
		this.mint_analytics_mints_pre = analytics_mints_pre;
		this.mint_analytics_melts = analytics_melts;
		this.mint_analytics_melts_pre = analytics_melts_pre;
		this.mint_analytics_transfers = analytics_transfers;
		this.mint_analytics_transfers_pre = analytics_transfers_pre;
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
			this.mintService.clearAnalyticsCache();
			this.loading_dynamic_data = true;
			this.changeDetectorRef.detectChanges();
			await this.loadMintAnalytics();
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

