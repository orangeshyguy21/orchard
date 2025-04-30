/* Core Dependencies */
import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
/* Vendor Dependencies */
import { forkJoin, lastValueFrom, Subscription } from 'rxjs';
import { DateTime } from 'luxon';
/* Application Configuration */
import { environment } from '@client/configs/configuration';
/* Application Dependencies */
import { SettingService } from '@client/modules/settings/services/setting/setting.service';
import { AiService } from '@client/modules/ai/services/ai/ai.service';
import { ChartService } from '@client/modules/chart/services/chart/chart.service';
import { PublicService } from '@client/modules/public/services/image/public.service';
import { NonNullableMintChartSettings } from '@client/modules/chart/services/chart/chart.types';
import { PublicUrl } from '@client/modules/public/classes/public-url.class';
import { AiChatToolCall } from '@client/modules/ai/classes/ai-chat-chunk.class';
/* Native Dependencies */
import { MintService } from '@client/modules/mint/services/mint/mint.service';
import { MintBalance } from '@client/modules/mint/classes/mint-balance.class';
import { MintKeyset } from '@client/modules/mint/classes/mint-keyset.class';
import { MintInfo } from '@client/modules/mint/classes/mint-info.class';
import { MintAnalytic } from '@client/modules/mint/classes/mint-analytic.class';
import { ChartType } from '@client/modules/mint/enums/chart-type.enum';
/* Shared Dependencies */
import { AiFunctionName, MintAnalyticsInterval, MintUnit } from '@shared/generated.types';

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
	public mint_connections: PublicUrl[] = []
	public locale!: string;
	// derived data
	public mint_genesis_time: number = 0;
	// state
	public loading_static_data: boolean = true;
	public loading_dynamic_data: boolean = true;
	public should_move_control: boolean = false;  // Controls where the panel renders
	// chart settings
	public chart_settings!: NonNullableMintChartSettings;

	public get active_keysets(): MintKeyset[] {
		return this.mint_keysets.filter(keyset => keyset.active);
	}

	private subscriptions: Subscription = new Subscription();

	constructor(
		private mintService: MintService,
		private settingService: SettingService,
		private chartService: ChartService,
		private publicService: PublicService,
		private aiService: AiService,
		private route: ActivatedRoute,
		private changeDetectorRef: ChangeDetectorRef
	) {}

	async ngOnInit(): Promise<void> {
		this.mint_info = this.route.snapshot.data['mint_info'];
		this.mint_balances = this.route.snapshot.data['mint_balances'];
		this.mint_keysets = this.route.snapshot.data['mint_keysets'];
		this.initMintConnections();
		const agent_subscription = this.getAgentSubscription();
		const tool_subscription = this.getToolSubscription();
		this.subscriptions.add(agent_subscription);
		this.subscriptions.add(tool_subscription);
		await this.initMintAnalytics();

	}

	private getAgentSubscription(): Subscription {
		return this.aiService.agent_requests$
			.subscribe(({ agent, content }) => {
				const form_string = JSON.stringify(this.chart_settings);
				this.aiService.openAiSocket(agent, content, form_string);
			});
	}

	private getToolSubscription(): Subscription {
		return this.aiService.tool_calls$
			.subscribe((tool_call: AiChatToolCall) => {
				this.executeAgentFunction(tool_call);
			});
	}

	private async initMintConnections(): Promise<void> {
		if( !this.mint_info?.urls ) return;
		if( this.mint_info.urls.length === 0 ) return;
		const test_urls = this.mint_info.urls.map((url) => {
			return `${url.replace(/\/$/, '')}${environment.cashu.critical_path}`;
		});
		this.publicService.getPublicUrlsData(test_urls)
			.subscribe((urls) => {
				this.mint_connections = urls;
				this.changeDetectorRef.detectChanges();
			});
	}
	
	private async initMintAnalytics(): Promise<void> {
		try {
			this.locale = await this.settingService.getLocale();
			this.mint_genesis_time = this.getMintGenesisTime();
			this.chart_settings = this.getChartSettings();
			console.log('CHART SETTINGS:', this.chart_settings);
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
			return keyset.valid_from < oldest_time || oldest_time === 0 
				? keyset.valid_from 
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

	private executeAgentFunction(tool_call: AiChatToolCall): void {
		console.log('TOOL CALL HEARD:', tool_call);
		if( tool_call.function.name === AiFunctionName.MintAnalyticsDateRangeUpdate ) {
			const range = [ tool_call.function.arguments.date_start, tool_call.function.arguments.date_end ];
			this.onDateChange(range);
		}
		if( tool_call.function.name === AiFunctionName.MintAnalyticsUnitsUpdate ) {
			this.onUnitsChange(tool_call.function.arguments.units);
		}
		if( tool_call.function.name === AiFunctionName.MintAnalyticsIntervalUpdate ) {
			this.onIntervalChange(tool_call.function.arguments.interval);
		}
		if( tool_call.function.name === AiFunctionName.MintAnalyticsTypeUpdate ) {
			this.onTypeChange(tool_call.function.arguments.type);
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

