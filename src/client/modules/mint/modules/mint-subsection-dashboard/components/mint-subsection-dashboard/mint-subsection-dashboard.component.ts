/* Core Dependencies */
import {
	Component,
	ChangeDetectionStrategy,
	OnInit,
	ChangeDetectorRef,
	OnDestroy,
	ViewChild,
	ElementRef,
	ViewChildren,
	QueryList,
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
/* Vendor Dependencies */
import {forkJoin, lastValueFrom, Subscription, EMPTY, catchError, finalize, tap, Observable} from 'rxjs';
import {DateTime} from 'luxon';
/* Application Dependencies */
import {ConfigService} from '@client/modules/config/services/config.service';
import {SettingService} from '@client/modules/settings/services/setting/setting.service';
import {AiService} from '@client/modules/ai/services/ai/ai.service';
import {PublicService} from '@client/modules/public/services/image/public.service';
import {LightningService} from '@client/modules/lightning/services/lightning/lightning.service';
import {NonNullableMintDashboardSettings} from '@client/modules/settings/types/setting.types';
import {PublicUrl} from '@client/modules/public/classes/public-url.class';
import {AiChatToolCall} from '@client/modules/ai/classes/ai-chat-chunk.class';
import {LightningBalance} from '@client/modules/lightning/classes/lightning-balance.class';
import {LightningAnalytics} from '@client/modules/lightning/classes/lightning-analytics.class';
import {OrchardError} from '@client/modules/error/types/error.types';
import {NavTertiaryItem} from '@client/modules/nav/types/nav-tertiary-item.type';
/* Native Dependencies */
import {MintService} from '@client/modules/mint/services/mint/mint.service';
import {MintBalance} from '@client/modules/mint/classes/mint-balance.class';
import {MintKeyset} from '@client/modules/mint/classes/mint-keyset.class';
import {MintInfo} from '@client/modules/mint/classes/mint-info.class';
import {MintFee} from '@client/modules/mint/classes/mint-fee.class';
import {MintAnalytic} from '@client/modules/mint/classes/mint-analytic.class';
import {ChartType} from '@client/modules/mint/enums/chart-type.enum';
/* Shared Dependencies */
import {AiFunctionName, OrchardAnalyticsInterval, MintUnit} from '@shared/generated.types';

enum NavTertiary {
	BalanceSheet = 'nav1',
	Mints = 'nav2',
	Melts = 'nav3',
	Swaps = 'nav4',
	FeeRevenue = 'nav5',
}

@Component({
	selector: 'orc-mint-subsection-dashboard',
	standalone: false,
	templateUrl: './mint-subsection-dashboard.component.html',
	styleUrl: './mint-subsection-dashboard.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionDashboardComponent implements OnInit, OnDestroy {
	@ViewChildren('nav1,nav2,nav3,nav4,nav5') nav_elements!: QueryList<ElementRef>;
	@ViewChild('chart_container', {static: false}) chart_container!: ElementRef;

	// data
	public mint_info: MintInfo | null = null;
	public mint_balances: MintBalance[] = [];
	public mint_keysets: MintKeyset[] = [];
	public mint_fees: MintFee[] = [];
	public mint_analytics_balances: MintAnalytic[] = [];
	public mint_analytics_balances_pre: MintAnalytic[] = [];
	public mint_analytics_mints: MintAnalytic[] = [];
	public mint_analytics_mints_pre: MintAnalytic[] = [];
	public mint_analytics_melts: MintAnalytic[] = [];
	public mint_analytics_melts_pre: MintAnalytic[] = [];
	public mint_analytics_swaps: MintAnalytic[] = [];
	public mint_analytics_swaps_pre: MintAnalytic[] = [];
	public mint_analytics_fees: MintAnalytic[] = [];
	public mint_analytics_fees_pre: MintAnalytic[] = [];
	public lightning_analytics_outbound: LightningAnalytics[] = [];
	public lightning_analytics_outbound_pre: LightningAnalytics[] = [];
	public mint_connections: PublicUrl[] = [];
	public lightning_enabled: boolean;
	public lightning_balance: LightningBalance | null = null;
	public locale!: string;
	// derived data
	public mint_genesis_time: number = 0;
	// state
	public mint_type!: string;
	public loading_static_data: boolean = true;
	public loading_dynamic_data: boolean = true;
	public loading_lightning: boolean = true;
	public errors_lightning: OrchardError[] = [];
	public mint_fee_revenue: boolean = false;
	// charts
	public page_settings!: NonNullableMintDashboardSettings;
	public tertiary_nav_items: Record<NavTertiary, NavTertiaryItem> = {
		[NavTertiary.BalanceSheet]: {title: 'Balance Sheet'},
		[NavTertiary.Mints]: {title: 'Mints'},
		[NavTertiary.Melts]: {title: 'Melts'},
		[NavTertiary.Swaps]: {title: 'Swaps'},
		[NavTertiary.FeeRevenue]: {title: 'Fee Revenue'},
	};

	public get tertiary_nav(): string[] {
		return this.page_settings?.tertiary_nav || [];
	}

	private subscriptions: Subscription = new Subscription();

	constructor(
		private configService: ConfigService,
		private mintService: MintService,
		private settingService: SettingService,
		private publicService: PublicService,
		private lightningService: LightningService,
		private aiService: AiService,
		private router: Router,
		private route: ActivatedRoute,
		private cdr: ChangeDetectorRef,
	) {
		this.lightning_enabled = this.configService.config.lightning.enabled;
	}

	/* *******************************************************
	   Initalization                      
	******************************************************** */

	async ngOnInit(): Promise<void> {
		this.mint_type = this.configService.config.mint.type;
		this.mint_info = this.route.snapshot.data['mint_info'];
		this.mint_balances = this.route.snapshot.data['mint_balances'];
		this.mint_keysets = this.route.snapshot.data['mint_keysets'];
		this.initMintConnections();
		this.orchardOptionalInit();
		this.getMintFees();
		await this.initAnalytics();
		this.mint_fee_revenue = this.getMintFeeRevenueState();
	}

	orchardOptionalInit(): void {
		if (this.configService.config.ai.enabled) {
			this.subscriptions.add(this.getAgentSubscription());
			this.subscriptions.add(this.getToolSubscription());
		}
		if (this.lightning_enabled) {
			this.subscriptions.add(this.getLightningBalanceSubscription());
		}
	}

	private getMintGenesisTime(): number {
		if (!this.mint_keysets || this.mint_keysets.length === 0) return 0;
		return this.mint_keysets.reduce((oldest_time, keyset) => {
			return keyset.valid_from < oldest_time || oldest_time === 0 ? keyset.valid_from : oldest_time;
		}, 0);
	}

	/* *******************************************************
		Subscriptions                      
	******************************************************** */

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

	/* *******************************************************
		Data                      
	******************************************************** */

	private async getMintFees(): Promise<void> {
		try {
			this.mint_fees = await lastValueFrom(this.mintService.loadMintFees(1));
		} catch {
			this.mint_fees = [];
		}
	}

	private getMintFeeRevenueState(): boolean {
		const fee_sum = this.mint_keysets.reduce((sum, keyset) => sum + (keyset?.fees_paid || 0), 0);
		return fee_sum > 0;
	}

	private async initMintConnections(): Promise<void> {
		if (!this.mint_info?.urls) return;
		if (this.mint_info.urls.length === 0) return;
		const test_urls = this.mint_info.urls.map((url) => {
			return `${url.replace(/\/$/, '')}${this.configService.config.mint.critical_path}`;
		});
		this.publicService.getPublicUrlsData(test_urls).subscribe((urls) => {
			this.mint_connections = urls;
			this.cdr.detectChanges();
		});
	}

	private async initAnalytics(): Promise<void> {
		try {
			this.locale = await this.settingService.getLocale();
			this.mint_genesis_time = this.getMintGenesisTime();
			this.page_settings = this.getPageSettings();
			this.updateTertiaryNav();
			this.loading_static_data = false;
			this.cdr.detectChanges();
			await this.loadAnalytics();
			this.loading_dynamic_data = false;
			this.cdr.detectChanges();
		} catch (error) {
			console.error('ERROR IN INIT MINT ANALYTICS:', error);
		}
	}

	private async loadAnalytics(): Promise<void> {
		const promises: Promise<void>[] = [this.loadMintAnalytics()];
		if (this.lightning_enabled) promises.push(this.loadLightningAnalytics());
		await Promise.all(promises);
	}

	private async loadMintAnalytics(): Promise<void> {
		const timezone = this.settingService.getTimezone();
		const args = {
			units: this.page_settings.units,
			date_start: this.page_settings.date_start,
			date_end: this.page_settings.date_end,
			interval: this.page_settings.interval,
			timezone: timezone,
		};
		const args_pre = {
			units: this.page_settings.units,
			date_start: 100000,
			date_end: this.page_settings.date_start - 1,
			interval: OrchardAnalyticsInterval.Custom,
			timezone: timezone,
		};
		const {units: _, ...lightning_args} = args;
		const {units: __, ...lightning_args_pre} = args_pre;

		const analytics_balances_obs = this.mintService.loadMintAnalyticsBalances(args);
		const analytics_balances_pre_obs = this.mintService.loadMintAnalyticsBalances(args_pre);
		const analytics_mints_obs = this.mintService.loadMintAnalyticsMints(args);
		const analytics_mints_pre_obs = this.mintService.loadMintAnalyticsMints(args_pre);
		const analytics_melts_obs = this.mintService.loadMintAnalyticsMelts(args);
		const analytics_melts_pre_obs = this.mintService.loadMintAnalyticsMelts(args_pre);
		const analytics_swaps_obs = this.mintService.loadMintAnalyticsSwaps(args);
		const analytics_swaps_pre_obs = this.mintService.loadMintAnalyticsSwaps(args_pre);
		const analytics_fees_obs = this.mintService.loadMintAnalyticsFees(args);
		const analytics_fees_pre_obs = this.mintService.loadMintAnalyticsFees(args_pre);

		const [
			analytics_balances,
			analytics_balances_pre,
			analytics_mints,
			analytics_mints_pre,
			analytics_melts,
			analytics_melts_pre,
			analytics_swaps,
			analytics_swaps_pre,
			analytics_fees,
			analytics_fees_pre,
		] = await lastValueFrom(
			forkJoin([
				analytics_balances_obs,
				analytics_balances_pre_obs,
				analytics_mints_obs,
				analytics_mints_pre_obs,
				analytics_melts_obs,
				analytics_melts_pre_obs,
				analytics_swaps_obs,
				analytics_swaps_pre_obs,
				analytics_fees_obs,
				analytics_fees_pre_obs,
			]),
		);

		this.mint_analytics_balances = analytics_balances;
		this.mint_analytics_balances_pre = analytics_balances_pre;
		this.mint_analytics_mints = analytics_mints;
		this.mint_analytics_mints_pre = analytics_mints_pre;
		this.mint_analytics_melts = analytics_melts;
		this.mint_analytics_melts_pre = analytics_melts_pre;
		this.mint_analytics_swaps = analytics_swaps;
		this.mint_analytics_swaps_pre = analytics_swaps_pre;
		this.mint_analytics_fees = this.applyMintFees(analytics_fees, analytics_fees_pre);
		this.mint_analytics_fees_pre = analytics_fees_pre;
	}

	private async loadLightningAnalytics(): Promise<void> {
		const timezone = this.settingService.getTimezone();
		const args = {
			date_start: this.page_settings.date_start,
			date_end: this.page_settings.date_end,
			interval: this.page_settings.interval,
			timezone: timezone,
		};
		const args_pre = {
			date_start: 100000,
			date_end: this.page_settings.date_start - 1,
			interval: OrchardAnalyticsInterval.Custom,
			timezone: timezone,
		};
		const analytics_outbound_obs = this.lightningService.loadLightningAnalyticsOutbound(args);
		const analytics_outbound_pre_obs = this.lightningService.loadLightningAnalyticsOutbound(args_pre);

		const [analytics_outbound, analytics_outbound_pre] = await lastValueFrom(
			forkJoin([analytics_outbound_obs, analytics_outbound_pre_obs]),
		);

		console.log('analytics_outbound', analytics_outbound);
		console.log('analytics_outbound_pre', analytics_outbound_pre);

		this.lightning_analytics_outbound = analytics_outbound;
		this.lightning_analytics_outbound_pre = analytics_outbound_pre;
	}

	private applyMintFees(analytics_fees: MintAnalytic[], analytics_fees_pre: MintAnalytic[]): MintAnalytic[] {
		if (analytics_fees_pre.length > 0) return analytics_fees;
		if (analytics_fees.length === 0) return analytics_fees;
		if (this.mint_fees.length === 0) return analytics_fees;
		analytics_fees[0].amount += this.mint_fees[0].keyset_fees_paid;
		return analytics_fees;
	}

	private async reloadDynamicData(): Promise<void> {
		try {
			this.mintService.clearDasbhoardCache();
			this.loading_dynamic_data = true;
			this.cdr.detectChanges();
			await this.loadAnalytics();
			this.loading_dynamic_data = false;
			this.cdr.detectChanges();
		} catch (error) {
			console.error('Error updating dynamic data:', error);
		}
	}

	/* *******************************************************
		Page Settings                      
	******************************************************** */

	private getPageSettings(): NonNullableMintDashboardSettings {
		const settings = this.settingService.getMintDashboardSettings();
		return {
			type: settings.type ?? ChartType.Summary,
			interval: settings.interval ?? OrchardAnalyticsInterval.Day,
			units: settings.units ?? this.getSelectedUnits(), // @todo there will be bugs here if a unit is not in the keysets (audit active keysets)
			date_start: settings.date_start ?? this.getSelectedDateStart(),
			date_end: settings.date_end ?? this.getSelectedDateEnd(),
			tertiary_nav: settings.tertiary_nav ?? Object.values(NavTertiary),
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

	/* *******************************************************
		AI                    
	******************************************************** */

	private executeAgentFunction(tool_call: AiChatToolCall): void {
		if (tool_call.function.name === AiFunctionName.AnalyticsDateRangeUpdate) {
			const range = [
				DateTime.fromFormat(tool_call.function.arguments.date_start, 'yyyy-MM-dd').toSeconds(),
				DateTime.fromFormat(tool_call.function.arguments.date_end, 'yyyy-MM-dd').toSeconds(),
			];
			this.onDateChange(range);
		}
		if (tool_call.function.name === AiFunctionName.MintAnalyticsUnitsUpdate) {
			this.onUnitsChange(tool_call.function.arguments.units);
		}
		if (tool_call.function.name === AiFunctionName.AnalyticsIntervalUpdate) {
			this.onIntervalChange(tool_call.function.arguments.interval);
		}
		if (tool_call.function.name === AiFunctionName.MintAnalyticsTypeUpdate) {
			this.onTypeChange(tool_call.function.arguments.type);
		}
	}

	/* *******************************************************
		Actions Up                     
	******************************************************** */

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

	public onIntervalChange(event: OrchardAnalyticsInterval): void {
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

	/* *******************************************************
		Tertiary Nav                      
	******************************************************** */

	public onTertiaryNavChange(event: string[]): void {
		this.page_settings.tertiary_nav = event;
		this.settingService.setMintDashboardSettings(this.page_settings);
		this.updateTertiaryNav();
	}

	public onTertiaryNavSelect(event: string): void {
		this.scrollToChart(event as NavTertiary);
	}

	private updateTertiaryNav(): void {
		const tertiary_nav = this.page_settings.tertiary_nav.map((area) => `"${area}"`).join(' ');
		this.chart_container.nativeElement.style.gridTemplateAreas = `${tertiary_nav}`;
	}

	private scrollToChart(nav_item: NavTertiary) {
		const target_element = this.nav_elements.find((el) => el.nativeElement.classList.contains(nav_item));
		if (!target_element?.nativeElement) return;
		target_element.nativeElement.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
			inline: 'nearest',
		});
	}

	/* *******************************************************
		Clean Up                      
	******************************************************** */

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}
}
