/* Core Dependencies */
import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
/* Vendor Dependencies */
import { forkJoin, lastValueFrom } from 'rxjs';
import { DateTime } from 'luxon';
/* Application Dependencies */
import { CacheService } from '@client/modules/cache/services/cache/cache.service';
import { SettingService } from '@client/modules/settings/services/setting/setting.service';
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

	public mint_info: MintInfo | null = null;
	public mint_balances: MintBalance[] = [];
	public mint_keysets: MintKeyset[] = [];
	public mint_analytics_balances: MintAnalytic[] = [];

	public loading_static_data: boolean = true;
	public loading_dynamic_data: boolean = true;
	public mint_genesis_time: number = 0;

	public selected_units: MintUnit[] = [];
	public selected_date_start!: number;
	public selected_date_end!: number;
	public selected_interval: MintAnalyticsInterval = MintAnalyticsInterval.Day;
	public selected_type!: ChartType;

	constructor(
		private mintService: MintService,
		private cacheService: CacheService,
		private settingService: SettingService,
		private changeDetectorRef: ChangeDetectorRef
	) {
		this.selected_type = ChartType.Summary;
	}

	async ngOnInit(): Promise<void> {
		try {
			await this.loadStaticData();
			this.mint_genesis_time = this.getMintGenesisTime();
			this.selected_units = this.getSelectedUnits();
			this.selected_date_start = this.getSelectedDateStart();
			this.selected_date_end = this.getSelectedDateEnd();
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
			units: this.selected_units,
			date_start: this.selected_date_start,
			date_end: this.selected_date_end,
			interval: this.selected_interval,
			timezone: timezone
		});
		const preceeding_sums_obs = this.mintService.loadMintAnalyticsBalances({
			units: this.selected_units,
			date_start: 100000,
			date_end: this.selected_date_start-1,
			interval: MintAnalyticsInterval.Custom,
			timezone: timezone
		});
		const [analytics_balances, preceeding_sums] = await lastValueFrom(
			forkJoin([analytics_balances_obs, preceeding_sums_obs])
		);

		console.log('preceeding_sums', preceeding_sums);

		this.mint_analytics_balances = analytics_balances;
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
			this.cacheService.clearCache(cache_key);
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
		this.selected_date_start = event[0];
		this.selected_date_end = event[1];
		this.reloadDynamicData();
	}

	public onUnitsChange(event: MintUnit[]): void {
		this.selected_units = event;
		this.reloadDynamicData();
	}

	public onIntervalChange(event: MintAnalyticsInterval): void {
		this.selected_interval = event;
		this.reloadDynamicData();
	}

	public onTypeChange(event: ChartType): void {
		this.selected_type = event;
		this.changeDetectorRef.detectChanges();
	}
}

