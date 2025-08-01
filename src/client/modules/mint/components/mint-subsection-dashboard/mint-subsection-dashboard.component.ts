/* Core Dependencies */
import {Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
/* Vendor Dependencies */
import {forkJoin, lastValueFrom, Subscription, EMPTY, catchError, finalize, tap} from 'rxjs';
import {DateTime} from 'luxon';
/* Application Configuration */
import {environment} from '@client/configs/configuration';
/* Application Dependencies */
import {SettingService} from '@client/modules/settings/services/setting/setting.service';
import {AiService} from '@client/modules/ai/services/ai/ai.service';
import {PublicService} from '@client/modules/public/services/image/public.service';
import {LightningService} from '@client/modules/lightning/services/lightning/lightning.service';
import {NonNullableMintDashboardSettings} from '@client/modules/settings/types/setting.types';
import {PublicUrl} from '@client/modules/public/classes/public-url.class';
import {AiChatToolCall} from '@client/modules/ai/classes/ai-chat-chunk.class';
import {LightningBalance} from '@client/modules/lightning/classes/lightning-balance.class';
import {OrchardError} from '@client/modules/error/types/error.types';
/* Native Dependencies */
import {MintService} from '@client/modules/mint/services/mint/mint.service';
import {MintBalance} from '@client/modules/mint/classes/mint-balance.class';
import {MintKeyset} from '@client/modules/mint/classes/mint-keyset.class';
import {MintInfo} from '@client/modules/mint/classes/mint-info.class';
import {MintAnalytic} from '@client/modules/mint/classes/mint-analytic.class';
import {ChartType} from '@client/modules/mint/enums/chart-type.enum';
/* Shared Dependencies */
import {AiFunctionName, MintAnalyticsInterval, MintUnit} from '@shared/generated.types';

@Component({
	selector: 'orc-mint-subsection-dashboard',
	standalone: false,
	templateUrl: './mint-subsection-dashboard.component.html',
	styleUrl: './mint-subsection-dashboard.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionDashboardComponent implements OnInit, OnDestroy {
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
	public mint_connections: PublicUrl[] = [];
	public lightning_enabled: boolean = environment.lightning.enabled;
	public lightning_balance: LightningBalance | null = null;
	public locale!: string;
	// derived data
	public mint_genesis_time: number = 0;
	// state
	public loading_static_data: boolean = true;
	public loading_dynamic_data: boolean = true;
	public loading_lightning: boolean = true;
	public errors_lightning: OrchardError[] = [];
	// chart settings
	public page_settings!: NonNullableMintDashboardSettings;

	private subscriptions: Subscription = new Subscription();

	constructor(
		private mintService: MintService,
		private settingService: SettingService,
		private publicService: PublicService,
		private lightningService: LightningService,
		private aiService: AiService,
		private router: Router,
		private route: ActivatedRoute,
		private cdr: ChangeDetectorRef,
	) {}

	async ngOnInit(): Promise<void> {
		this.mint_info = this.route.snapshot.data['mint_info'];
		this.mint_balances = this.route.snapshot.data['mint_balances'];
		this.mint_keysets = this.route.snapshot.data['mint_keysets'];
		this.initMintConnections();
		this.orchardOptionalInit();
		await this.initMintAnalytics();
	}

	orchardOptionalInit(): void {
		if (environment.ai.enabled) {
			this.subscriptions.add(this.getAgentSubscription());
			this.subscriptions.add(this.getToolSubscription());
		}
		if (this.lightning_enabled) {
			this.subscriptions.add(this.getLightningBalanceSubscription());
		}
	}

	private getAgentSubscription(): Subscription {
		return this.aiService.agent_requests$.subscribe(({agent, content}) => {
			let context = `* **Current Date:** ${DateTime.now().toFormat('yyyy-MM-dd')}\n`;
			context += `* **Date Start:** ${DateTime.fromSeconds(this.page_settings.date_start).toFormat('yyyy-MM-dd')}\n`;
			context += `* **Date End:** ${DateTime.fromSeconds(this.page_settings.date_end).toFormat('yyyy-MM-dd')}\n`;
			context += `* **Interval:** ${this.page_settings.interval}\n`;
			context += `* **Units:** ${this.page_settings.units.join(', ')}\n`;
			context += `* **Type:** ${this.page_settings.type}`;
			this.aiService.openAiSocket(agent, content, context);
		});
	}

	private getToolSubscription(): Subscription {
		return this.aiService.tool_calls$.subscribe((tool_call: AiChatToolCall) => {
			this.executeAgentFunction(tool_call);
		});
	}

	private getLightningBalanceSubscription(): Subscription {
		return this.lightningService
			.loadLightningBalance()
			.pipe(
				tap((balance) => {
					this.lightning_balance = balance;
					this.cdr.detectChanges();
				}),
				catchError((error) => {
					this.errors_lightning = error.errors;
					return EMPTY;
				}),
				finalize(() => {
					this.loading_lightning = false;
					this.cdr.detectChanges();
				}),
			)
			.subscribe();
	}

	private async initMintConnections(): Promise<void> {
		if (!this.mint_info?.urls) return;
		if (this.mint_info.urls.length === 0) return;
		const test_urls = this.mint_info.urls.map((url) => {
			return `${url.replace(/\/$/, '')}${environment.mint.critical_path}`;
		});
		this.publicService.getPublicUrlsData(test_urls).subscribe((urls) => {
			this.mint_connections = urls;
			this.cdr.detectChanges();
		});
	}

	private async initMintAnalytics(): Promise<void> {
		try {
			this.locale = await this.settingService.getLocale();
			this.mint_genesis_time = this.getMintGenesisTime();
			this.page_settings = this.getPageSettings();
			this.loading_static_data = false;
			this.cdr.detectChanges();
			await this.loadMintAnalytics();
			this.loading_dynamic_data = false;
			this.cdr.detectChanges();
		} catch (error) {
			console.error('ERROR IN INIT MINT ANALYTICS:', error);
		}
	}

	private async loadMintAnalytics(): Promise<void> {
		const timezone = this.settingService.getTimezone();
		const analytics_balances_obs = this.mintService.loadMintAnalyticsBalances({
			units: this.page_settings.units,
			date_start: this.page_settings.date_start,
			date_end: this.page_settings.date_end,
			interval: this.page_settings.interval,
			timezone: timezone,
		});
		const analytics_balances_pre_obs = this.mintService.loadMintAnalyticsBalances({
			units: this.page_settings.units,
			date_start: 100000,
			date_end: this.page_settings.date_start - 1,
			interval: MintAnalyticsInterval.Custom,
			timezone: timezone,
		});
		const analytics_mints_obs = this.mintService.loadMintAnalyticsMints({
			units: this.page_settings.units,
			date_start: this.page_settings.date_start,
			date_end: this.page_settings.date_end,
			interval: this.page_settings.interval,
			timezone: timezone,
		});
		const analytics_mints_pre_obs = this.mintService.loadMintAnalyticsMints({
			units: this.page_settings.units,
			date_start: 100000,
			date_end: this.page_settings.date_start - 1,
			interval: MintAnalyticsInterval.Custom,
			timezone: timezone,
		});
		const analytics_melts_obs = this.mintService.loadMintAnalyticsMelts({
			units: this.page_settings.units,
			date_start: this.page_settings.date_start,
			date_end: this.page_settings.date_end,
			interval: this.page_settings.interval,
			timezone: timezone,
		});
		const analytics_melts_pre_obs = this.mintService.loadMintAnalyticsMelts({
			units: this.page_settings.units,
			date_start: 100000,
			date_end: this.page_settings.date_start - 1,
			interval: MintAnalyticsInterval.Custom,
			timezone: timezone,
		});
		const analytics_transfers_obs = this.mintService.loadMintAnalyticsTransfers({
			units: this.page_settings.units,
			date_start: this.page_settings.date_start,
			date_end: this.page_settings.date_end,
			interval: this.page_settings.interval,
			timezone: timezone,
		});
		const analytics_transfers_pre_obs = this.mintService.loadMintAnalyticsTransfers({
			units: this.page_settings.units,
			date_start: 100000,
			date_end: this.page_settings.date_start - 1,
			interval: MintAnalyticsInterval.Custom,
			timezone: timezone,
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
			]),
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

	private getPageSettings(): NonNullableMintDashboardSettings {
		const settings = this.settingService.getMintDashboardSettings();
		return {
			type: settings.type ?? ChartType.Summary,
			interval: settings.interval ?? MintAnalyticsInterval.Day,
			units: settings.units ?? this.getSelectedUnits(), // @todo there will be bugs here if a unit is not in the keysets (audit active keysets)
			date_start: settings.date_start ?? this.getSelectedDateStart(),
			date_end: settings.date_end ?? this.getSelectedDateEnd(),
		};
	}

	private getSelectedUnits(): MintUnit[] {
		return Array.from(new Set(this.mint_keysets.map((keyset) => keyset.unit)));
	}

	private getSelectedDateStart(): number {
		const three_months_ago = DateTime.now().minus({months: 3}).startOf('day');
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
			return keyset.valid_from < oldest_time || oldest_time === 0 ? keyset.valid_from : oldest_time;
		}, 0);
	}

	private async reloadDynamicData(): Promise<void> {
		try {
			this.mintService.clearDasbhoardCache();
			this.loading_dynamic_data = true;
			this.cdr.detectChanges();
			await this.loadMintAnalytics();
			this.loading_dynamic_data = false;
			this.cdr.detectChanges();
		} catch (error) {
			console.error('Error updating dynamic data:', error);
		}
	}

	private executeAgentFunction(tool_call: AiChatToolCall): void {
		if (tool_call.function.name === AiFunctionName.MintAnalyticsDateRangeUpdate) {
			const range = [
				DateTime.fromFormat(tool_call.function.arguments.date_start, 'yyyy-MM-dd').toSeconds(),
				DateTime.fromFormat(tool_call.function.arguments.date_end, 'yyyy-MM-dd').toSeconds(),
			];
			this.onDateChange(range);
		}
		if (tool_call.function.name === AiFunctionName.MintAnalyticsUnitsUpdate) {
			this.onUnitsChange(tool_call.function.arguments.units);
		}
		if (tool_call.function.name === AiFunctionName.MintAnalyticsIntervalUpdate) {
			this.onIntervalChange(tool_call.function.arguments.interval);
		}
		if (tool_call.function.name === AiFunctionName.MintAnalyticsTypeUpdate) {
			this.onTypeChange(tool_call.function.arguments.type);
		}
	}

	public onDateChange(event: number[]): void {
		this.page_settings.date_start = event[0];
		this.page_settings.date_end = event[1];
		this.settingService.setMintDashboardSettings(this.page_settings);
		this.reloadDynamicData();
	}

	public onUnitsChange(event: MintUnit[]): void {
		this.page_settings.units = event;
		this.settingService.setMintDashboardSettings(this.page_settings);
		this.reloadDynamicData();
	}

	public onIntervalChange(event: MintAnalyticsInterval): void {
		this.page_settings.interval = event;
		this.settingService.setMintDashboardSettings(this.page_settings);
		this.reloadDynamicData();
	}

	public onTypeChange(event: ChartType): void {
		this.page_settings.type = event;
		this.settingService.setMintDashboardSettings(this.page_settings);
		this.reloadDynamicData();
	}

	public onNavigate(route: string): void {
		this.router.navigate([`/${route}`]);
	}

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}
}
