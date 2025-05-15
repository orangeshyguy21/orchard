/* Core Dependencies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
/* Vendor Dependencies */
import { lastValueFrom, forkJoin } from 'rxjs';
import { DateTime } from 'luxon';
/* Application Dependencies */
import { SettingService } from '@client/modules/settings/services/setting/setting.service';
import { ChartService } from '@client/modules/chart/services/chart/chart.service';
import { NonNullableMintKeysetsSettings } from '@client/modules/chart/services/chart/chart.types';
/* Native Dependencies */
import { MintService } from '@client/modules/mint/services/mint/mint.service';
import { MintKeyset } from '@client/modules/mint/classes/mint-keyset.class';
import { MintAnalyticKeyset } from '@client/modules/mint/classes/mint-analytic.class';
/* Shared Dependencies */
import { MintUnit, MintAnalyticsInterval } from '@shared/generated.types';

@Component({
	selector: 'orc-mint-subsection-keysets',
	standalone: false,
	templateUrl: './mint-subsection-keysets.component.html',
	styleUrl: './mint-subsection-keysets.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintSubsectionKeysetsComponent {

	public mint_keysets: MintKeyset[] = [];
	public locale!: string;
	public mint_genesis_time: number = 0;
	public chart_settings!: NonNullableMintKeysetsSettings;
	public data_loading: boolean = true;
	public keysets_analytics: MintAnalyticKeyset[] = [];
	public keysets_analytics_pre: MintAnalyticKeyset[] = [];

	

	constructor(
		public route: ActivatedRoute,
		private settingService: SettingService,
		private chartService: ChartService,
		private mintService: MintService,
		private cdr: ChangeDetectorRef,
	) {}

	ngOnInit(): void {		
		this.mint_keysets = this.route.snapshot.data['mint_keysets'];
		this.initKeysetsAnalytics();
		console.log('keysets', this.mint_keysets);
	}

	private async initKeysetsAnalytics(): Promise<void> {
		this.locale = this.settingService.getLocale();
		this.mint_genesis_time = this.getMintGenesisTime();
		this.chart_settings = this.getChartSettings();
		const interval = this.getAnalyticsInterval();
		const timezone = this.settingService.getTimezone();
		await this.loadKeysetsAnalytics(timezone, interval);
		this.data_loading = false;
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

	private getChartSettings(): NonNullableMintKeysetsSettings {
		const settings = this.chartService.getMintKeysetsSettings();
		return {
			units: settings.units ?? this.getSelectedUnits(), // @todo there will be bugs here if a unit is not in the keysets (audit active keysets)
			date_start: settings.date_start ?? this.mint_genesis_time,
			date_end: settings.date_end ?? this.getSelectedDateEnd()
		};
	}

	private getSelectedUnits(): MintUnit[] {
		return Array.from(new Set(this.mint_keysets.map(keyset => keyset.unit)));
	}

	private getSelectedDateEnd(): number {
		const today = DateTime.now().endOf('day');
		return Math.floor(today.toSeconds());
	}

	private getAnalyticsInterval(): MintAnalyticsInterval {
		return MintAnalyticsInterval.Day;
	}

	private async loadKeysetsAnalytics(timezone: string, interval: MintAnalyticsInterval): Promise<void> {
		const analytics_keysets_obs = this.mintService.loadMintAnalyticsKeysets({
			date_start: this.chart_settings.date_start,
			date_end: this.chart_settings.date_end,
			interval: interval,
			timezone: timezone
		});
		const analytics_keysets_pre_obs = this.mintService.loadMintAnalyticsKeysets({
			date_start: 100000,
			date_end: this.chart_settings.date_start-1,
			interval: MintAnalyticsInterval.Custom,
			timezone: timezone
		});

		const [
			analytics_keysets,
			analytics_keysets_pre,
		] = await lastValueFrom(
			forkJoin([
				analytics_keysets_obs,
				analytics_keysets_pre_obs,
			])
		);
		
		this.keysets_analytics = analytics_keysets;
		this.keysets_analytics_pre = analytics_keysets_pre;
	}
}
