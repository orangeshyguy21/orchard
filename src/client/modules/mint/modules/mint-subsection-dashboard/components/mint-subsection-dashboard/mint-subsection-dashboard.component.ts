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
	signal,
	computed,
	WritableSignal,
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
/* Vendor Dependencies */
import {forkJoin, lastValueFrom, Subscription, EMPTY, catchError, finalize, tap} from 'rxjs';
import {DateTime} from 'luxon';
/* Application Dependencies */
import {ConfigService} from '@client/modules/config/services/config.service';
import {SettingDeviceService} from '@client/modules/settings/services/setting-device/setting-device.service';
import {SettingAppService} from '@client/modules/settings/services/setting-app/setting-app.service';
import {AiService} from '@client/modules/ai/services/ai/ai.service';
import {PublicService} from '@client/modules/public/services/image/public.service';
import {PublicImage} from '@client/modules/public/classes/public-image.class';
import {LightningService} from '@client/modules/lightning/services/lightning/lightning.service';
import {NonNullableMintDashboardSettings} from '@client/modules/settings/types/setting.types';
import {PublicUrl} from '@client/modules/public/classes/public-url.class';
import {AiChatToolCall} from '@client/modules/ai/classes/ai-chat-chunk.class';
import {BitcoinService} from '@client/modules/bitcoin/services/bitcoin/bitcoin.service';
import {LightningBalance} from '@client/modules/lightning/classes/lightning-balance.class';
import {LightningAnalytic} from '@client/modules/lightning/classes/lightning-analytic.class';
import {LightningAnalyticsBackfillStatus} from '@client/modules/lightning/classes/lightning-analytics-backfill-status.class';
import {LightningAnalyticsArgs} from '@client/modules/lightning/types/lightning.types';
import {OrchardError} from '@client/modules/error/types/error.types';
import {NavTertiaryItem} from '@client/modules/nav/types/nav-tertiary-item.type';
import {DeviceType} from '@client/modules/layout/types/device.types';
import {BitcoinOraclePrice} from '@client/modules/bitcoin/classes/bitcoin-oracle-price.class';
/* Native Dependencies */
import {MintService} from '@client/modules/mint/services/mint/mint.service';
import {MintBalance} from '@client/modules/mint/classes/mint-balance.class';
import {MintKeyset} from '@client/modules/mint/classes/mint-keyset.class';
import {MintInfo} from '@client/modules/mint/classes/mint-info.class';
import {MintFee} from '@client/modules/mint/classes/mint-fee.class';
import {MintAnalytic} from '@client/modules/mint/classes/mint-analytic.class';
import {MintKeysetProofCount} from '@client/modules/mint/classes/mint-keyset-proof-count.class';
import {MintQuoteTtls} from '@client/modules/mint/classes/mint-quote-ttls.class';
import {MintPulse} from '@client/modules/mint/classes/mint-pulse.class';
import {ChartType} from '@client/modules/mint/enums/chart-type.enum';
/* Shared Dependencies */
import {AiFunctionName, MintAnalyticsInterval, MintUnit, LightningAnalyticsInterval} from '@shared/generated.types';

enum NavTertiary {
	BalanceSheet = 'nav1',
	Mints = 'nav2',
	Melts = 'nav3',
	Swaps = 'nav4',
	FeeRevenue = 'nav5',
}

type ChartKey = 'balance_sheet' | 'mints' | 'melts' | 'swaps' | 'fee_revenue';

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
	public mint_connections: PublicUrl[] = [];
	public lightning_enabled: boolean;
	public lightning_balance: LightningBalance | null = null;
	public lightning_analytics: LightningAnalytic[] = [];
	public lightning_analytics_pre: LightningAnalytic[] = [];
	public lightning_analytics_backfill_status: LightningAnalyticsBackfillStatus | null = null;
	public locale!: string;
	public bitcoin_oracle_enabled: boolean;
	// derived data
	public mint_genesis_time: number = 0;
	// state
	public mint_type!: string;
	public loading_static_data: boolean = true;
	// summary card data
	public mint_keyset_proof_counts: MintKeysetProofCount[] = [];
	public mint_quote_ttls: MintQuoteTtls | null = null;
	public mint_pulse: MintPulse | null = null;
	public mint_database_size: number | null = null;

	public errors_lightning: OrchardError[] = [];
	// charts
	public page_settings: WritableSignal<NonNullableMintDashboardSettings>;
	public tertiary_nav_items: Record<NavTertiary, NavTertiaryItem> = {
		[NavTertiary.BalanceSheet]: {title: 'Balance Sheet'},
		[NavTertiary.Mints]: {title: 'Mints'},
		[NavTertiary.Melts]: {title: 'Melts'},
		[NavTertiary.Swaps]: {title: 'Swaps'},
		[NavTertiary.FeeRevenue]: {title: 'Fee Revenue'},
	};
	public chart_type_options: Record<string, ChartType[]> = {
		balance_sheet: [ChartType.Totals, ChartType.Volume, ChartType.Operations],
		mints: [ChartType.Totals, ChartType.Volume, ChartType.Operations],
		melts: [ChartType.Totals, ChartType.Volume, ChartType.Operations],
		swaps: [ChartType.Totals, ChartType.Volume, ChartType.Operations],
		fee_revenue: [ChartType.Totals, ChartType.Volume],
	};

	public mint_fee_revenue = signal<boolean>(false);
	public device_type = signal<DeviceType>('desktop');
	public loading_mint = signal<boolean>(true);
	public loading_mint_icon = signal<boolean>(true);
	public loading_bitcoin = signal<boolean>(false);
	public loading_lightning = signal<boolean>(false);
	public bitcoin_oracle_price = signal<BitcoinOraclePrice | null>(null);
	public bitcoin_oracle_price_map = signal<Map<number, number> | null>(null);
	public mint_icon_data = signal<string | null>(null);

	public tertiary_nav = computed(() => this.page_settings().tertiary_nav || []);
	public type_balance_sheet = computed(() => this.page_settings().type.balance_sheet || ChartType.Totals);
	public type_mints = computed(() => this.page_settings().type.mints || ChartType.Volume);
	public type_melts = computed(() => this.page_settings().type.melts || ChartType.Volume);
	public type_swaps = computed(() => this.page_settings().type.swaps || ChartType.Volume);
	public type_fee_revenue = computed(() => this.page_settings().type.fee_revenue || ChartType.Volume);
	public loading_analytics = computed(() => this.loading_mint() || this.loading_bitcoin());
	public loading_summary = signal<boolean>(true);
	public sparkline_data = signal<number[]>([]);
	public mint_count_7d = signal<number>(0);
	public melt_count_7d = signal<number>(0);
	public swap_count_7d = signal<number>(0);
	public mint_sparkline_7d = signal<number[]>([]);
	public melt_sparkline_7d = signal<number[]>([]);
	public swap_sparkline_7d = signal<number[]>([]);

	private subscriptions: Subscription = new Subscription();

	constructor(
		private configService: ConfigService,
		private mintService: MintService,
		private settingDeviceService: SettingDeviceService,
		private settingAppService: SettingAppService,
		private publicService: PublicService,
		private bitcoinService: BitcoinService,
		private lightningService: LightningService,
		private aiService: AiService,
		private breakpointObserver: BreakpointObserver,
		private router: Router,
		private route: ActivatedRoute,
		private cdr: ChangeDetectorRef,
	) {
		this.bitcoin_oracle_enabled = this.settingAppService.getSetting('bitcoin_oracle');
		this.lightning_enabled = this.configService.config.lightning.enabled;
		this.mint_type = this.configService.config.mint.type;
		this.mint_info = this.route.snapshot.data['mint_info'];
		this.mint_balances = this.route.snapshot.data['mint_balances'];
		this.mint_keysets = this.route.snapshot.data['mint_keysets'];
		this.mint_genesis_time = this.getMintGenesisTime();
		this.page_settings = signal(this.getPageSettings());
	}

	/* *******************************************************
	   Initalization                      
	******************************************************** */

	async ngOnInit(): Promise<void> {
		this.initMintConnections();
		this.setMintIcon();
		this.orchardOptionalInit();
		this.getMintFees();
		this.initSummaryCards();
		await this.initAnalytics();
		this.mint_fee_revenue.set(this.getMintFeeRevenueState());
		this.subscriptions.add(this.getBreakpointSubscription());
	}

	orchardOptionalInit(): void {
		if (this.configService.config.ai.enabled) {
			this.subscriptions.add(this.getAgentSubscription());
			this.subscriptions.add(this.getToolSubscription());
		}
		if (this.bitcoin_oracle_enabled) {
			this.loading_bitcoin.set(true);
			this.subscriptions.add(this.getBitcoinOraclePriceSubscription());
			this.subscriptions.add(this.getBitcoinOraclePriceMapSubscription());
		}
		if (this.lightning_enabled) {
			this.loading_lightning.set(true);
			this.subscriptions.add(this.getLightningBalanceSubscription());
		}
	}

	private getMintGenesisTime(): number {
		const valid_times = this.mint_keysets?.filter((keyset) => keyset.valid_from != null).map((keyset) => keyset.valid_from!) ?? [];
		return valid_times.length > 0 ? Math.min(...valid_times) : 0;
	}

	private setMintIcon(): void {
		if (!this.mint_info?.icon_url) {
			this.mint_icon_data.set(null);
			this.loading_mint_icon.set(false);
			return;
		}
		this.publicService.getPublicImageData(this.mint_info?.icon_url).subscribe((image: PublicImage) => {
			this.mint_icon_data.set(image.data);
			this.loading_mint_icon.set(false);
		});
	}

	/** Loads data for the summary cards in parallel with analytics. */
	private initSummaryCards(): void {
		const timezone = this.settingDeviceService.getTimezone();
		const now = Math.floor(DateTime.now().toSeconds());
		const seven_days_ago = Math.floor(DateTime.now().minus({days: 7}).startOf('day').toSeconds());

		forkJoin([
			this.mintService.loadMintKeysetProofCounts({}),
			this.mintService.getMintQuoteTtls(),
			this.mintService.getMintPulse(),
			this.mintService.loadMintAnalyticsMints({
				units: [],
				date_start: seven_days_ago,
				date_end: now,
				interval: MintAnalyticsInterval.Day,
				timezone: timezone,
			}),
			this.mintService.loadMintAnalyticsMelts({
				units: [],
				date_start: seven_days_ago,
				date_end: now,
				interval: MintAnalyticsInterval.Day,
				timezone: timezone,
			}),
			this.mintService.loadMintAnalyticsSwaps({
				units: [],
				date_start: seven_days_ago,
				date_end: now,
				interval: MintAnalyticsInterval.Day,
				timezone: timezone,
			}),
			this.mintService.getMintDatabaseSize(),
		])
			.pipe(
				catchError((error) => {
					console.error('Error loading summary cards:', error);
					this.loading_summary.set(false);
					this.cdr.detectChanges();
					return EMPTY;
				}),
			)
			.subscribe(([proof_counts, quote_ttls, pulse, sparkline_mints, sparkline_melts, sparkline_swaps, database_size]) => {
				this.mint_keyset_proof_counts = proof_counts;
				this.mint_quote_ttls = quote_ttls;
				this.mint_pulse = pulse;
				this.mint_database_size = database_size;
				this.sparkline_data.set(this.buildSparklineData(sparkline_mints, sparkline_melts, sparkline_swaps));
				this.mint_count_7d.set(sparkline_mints.reduce((sum, a) => sum + a.operation_count, 0));
				this.melt_count_7d.set(sparkline_melts.reduce((sum, a) => sum + a.operation_count, 0));
				this.swap_count_7d.set(sparkline_swaps.reduce((sum, a) => sum + a.operation_count, 0));
				this.mint_sparkline_7d.set(this.buildDailySparkline(sparkline_mints));
				this.melt_sparkline_7d.set(this.buildDailySparkline(sparkline_melts));
				this.swap_sparkline_7d.set(this.buildDailySparkline(sparkline_swaps));
				this.loading_summary.set(false);
				this.cdr.detectChanges();
			});
	}

	/** Aggregates analytics data into daily operation counts for the sparkline. */
	private buildSparklineData(mints: MintAnalytic[], melts: MintAnalytic[], swaps: MintAnalytic[]): number[] {
		const day_map = new Map<number, number>();
		for (const analytic of [...mints, ...melts, ...swaps]) {
			const current = day_map.get(analytic.created_time) ?? 0;
			day_map.set(analytic.created_time, current + analytic.operation_count);
		}
		const sorted_keys = Array.from(day_map.keys()).sort((a, b) => a - b);
		return sorted_keys.map((key) => day_map.get(key) ?? 0);
	}

	/** Aggregates a single analytics type into daily operation counts. */
	private buildDailySparkline(analytics: MintAnalytic[]): number[] {
		const day_map = new Map<number, number>();
		for (const analytic of analytics) {
			const current = day_map.get(analytic.created_time) ?? 0;
			day_map.set(analytic.created_time, current + analytic.operation_count);
		}
		const sorted_keys = Array.from(day_map.keys()).sort((a, b) => a - b);
		return sorted_keys.map((key) => day_map.get(key) ?? 0);
	}

	/* *******************************************************
		Subscriptions                      
	******************************************************** */

	private getAgentSubscription(): Subscription {
		return this.aiService.agent_requests$.subscribe(({agent, content}) => {
			let context = `* **Current Date:** ${DateTime.now().toFormat('yyyy-MM-dd')}\n`;
			context += `* **Date Start:** ${DateTime.fromSeconds(this.page_settings().date_start).toFormat('yyyy-MM-dd')}\n`;
			context += `* **Date End:** ${DateTime.fromSeconds(this.page_settings().date_end).toFormat('yyyy-MM-dd')}\n`;
			context += `* **Interval:** ${this.page_settings().interval}\n`;
			context += `* **Units:** ${this.page_settings().units.join(', ')}\n`;
			this.aiService.openAiSocket(agent, content, context);
		});
	}

	private getToolSubscription(): Subscription {
		return this.aiService.tool_calls$.subscribe((tool_call: AiChatToolCall) => {
			this.executeAgentFunction(tool_call);
		});
	}

	private getBitcoinOraclePriceSubscription(): Subscription {
		return this.bitcoinService.loadBitcoinOraclePrice().subscribe((price) => {
			this.bitcoin_oracle_price.set(price);
		});
	}

	private getBitcoinOraclePriceMapSubscription(): Subscription {
		const start_date = this.page_settings().date_start;
		const end_date = this.page_settings().date_end;
		return this.bitcoinService.loadBitcoinOraclePriceMap(start_date, end_date).subscribe((price_map) => {
			this.bitcoin_oracle_price_map.set(price_map);
			this.loading_bitcoin.set(false);
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
					this.cdr.detectChanges();
					return EMPTY;
				}),
				finalize(() => {
					this.loading_lightning.set(false);
				}),
			)
			.subscribe();
	}

	public getBreakpointSubscription(): Subscription {
		return this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium]).subscribe((result) => {
			if (result.breakpoints[Breakpoints.XSmall]) {
				this.device_type.set('mobile');
			} else if (result.breakpoints[Breakpoints.Small] || result.breakpoints[Breakpoints.Medium]) {
				this.device_type.set('tablet');
			} else {
				this.device_type.set('desktop');
			}
		});
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
			this.locale = await this.settingDeviceService.getLocale();
			this.updateTertiaryNav();
			this.loading_static_data = false;
			this.cdr.detectChanges();
			await this.loadMintAnalytics();
			if (this.lightning_enabled) await this.loadLightningAnalytics();
			this.loading_mint.set(false);
			this.cdr.detectChanges();
		} catch (error) {
			console.error('ERROR IN INIT ANALYTICS:', error);
		}
	}

	private async loadMintAnalytics(): Promise<void> {
		const timezone = this.settingDeviceService.getTimezone();
		const analytics_balances_obs = this.mintService.loadMintAnalyticsBalances({
			units: this.page_settings().units,
			date_start: this.page_settings().date_start,
			date_end: this.page_settings().date_end,
			interval: this.page_settings().interval,
			timezone: timezone,
		});
		const analytics_balances_pre_obs = this.mintService.loadMintAnalyticsBalances({
			units: this.page_settings().units,
			date_start: this.configService.config.constants.epoch_start,
			date_end: this.page_settings().date_start - 1,
			interval: MintAnalyticsInterval.Custom,
			timezone: timezone,
		});
		const analytics_mints_obs = this.mintService.loadMintAnalyticsMints({
			units: this.page_settings().units,
			date_start: this.page_settings().date_start,
			date_end: this.page_settings().date_end,
			interval: this.page_settings().interval,
			timezone: timezone,
		});
		const analytics_mints_pre_obs = this.mintService.loadMintAnalyticsMints({
			units: this.page_settings().units,
			date_start: this.configService.config.constants.epoch_start,
			date_end: this.page_settings().date_start - 1,
			interval: MintAnalyticsInterval.Custom,
			timezone: timezone,
		});
		const analytics_melts_obs = this.mintService.loadMintAnalyticsMelts({
			units: this.page_settings().units,
			date_start: this.page_settings().date_start,
			date_end: this.page_settings().date_end,
			interval: this.page_settings().interval,
			timezone: timezone,
		});
		const analytics_melts_pre_obs = this.mintService.loadMintAnalyticsMelts({
			units: this.page_settings().units,
			date_start: this.configService.config.constants.epoch_start,
			date_end: this.page_settings().date_start - 1,
			interval: MintAnalyticsInterval.Custom,
			timezone: timezone,
		});
		const analytics_swaps_obs = this.mintService.loadMintAnalyticsSwaps({
			units: this.page_settings().units,
			date_start: this.page_settings().date_start,
			date_end: this.page_settings().date_end,
			interval: this.page_settings().interval,
			timezone: timezone,
		});
		const analytics_swaps_pre_obs = this.mintService.loadMintAnalyticsSwaps({
			units: this.page_settings().units,
			date_start: this.configService.config.constants.epoch_start,
			date_end: this.page_settings().date_start - 1,
			interval: MintAnalyticsInterval.Custom,
			timezone: timezone,
		});
		const analytics_fees_obs = this.mintService.loadMintAnalyticsFees({
			units: this.page_settings().units,
			date_start: this.page_settings().date_start,
			date_end: this.page_settings().date_end,
			interval: this.page_settings().interval,
			timezone: timezone,
		});
		const analytics_fees_pre_obs = this.mintService.loadMintAnalyticsFees({
			units: this.page_settings().units,
			date_start: this.configService.config.constants.epoch_start,
			date_end: this.page_settings().date_start - 1,
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
		const timezone = this.settingDeviceService.getTimezone();
		const interval = this.page_settings().interval as unknown as LightningAnalyticsInterval;
		const args: LightningAnalyticsArgs = {
			date_start: this.page_settings().date_start,
			date_end: this.page_settings().date_end,
			interval: interval,
			timezone: timezone,
		};
		const [analytics, analytics_pre, backfill_status] = await lastValueFrom(
			forkJoin([
				this.lightningService.loadLightningAnalytics(args),
				this.lightningService.loadLightningAnalytics({
					...args,
					date_start: this.configService.config.constants.epoch_start,
					date_end: this.page_settings().date_start - 1,
					interval: LightningAnalyticsInterval.Custom,
				}),
				this.lightningService.loadLightningAnalyticsBackfillStatus(),
			]),
		);
		this.lightning_analytics = analytics;
		this.lightning_analytics_pre = analytics_pre;
		this.lightning_analytics_backfill_status = backfill_status;
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
			this.lightningService.clearAnalyticsCache();
			this.loading_mint.set(true);
			this.cdr.detectChanges();
			await this.loadMintAnalytics();
			if (this.lightning_enabled) await this.loadLightningAnalytics();
			this.loading_mint.set(false);
			this.cdr.detectChanges();
		} catch (error) {
			console.error('Error updating dynamic data:', error);
		}
	}

	/* *******************************************************
		Settings                      
	******************************************************** */

	private getPageSettings(): NonNullableMintDashboardSettings {
		const settings = this.settingDeviceService.getMintDashboardSettings();
		return {
			type: {
				balance_sheet: settings.type?.balance_sheet ?? ChartType.Totals,
				mints: settings.type?.mints ?? ChartType.Volume,
				melts: settings.type?.melts ?? ChartType.Volume,
				swaps: settings.type?.swaps ?? ChartType.Volume,
				fee_revenue: settings.type?.fee_revenue ?? ChartType.Volume,
			},
			interval: settings.interval ?? MintAnalyticsInterval.Day,
			units: settings.units ?? [],
			date_start: settings.date_start ?? this.getSelectedDateStart(),
			date_end: settings.date_end ?? this.getSelectedDateEnd(),
			tertiary_nav: settings.tertiary_nav ?? Object.values(NavTertiary),
			oracle_used: this.bitcoin_oracle_enabled ? (settings.oracle_used ?? false) : false,
		};
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

	public getChartType(key: ChartKey): ChartType | null {
		return this.page_settings().type[key];
	}

	/* *******************************************************
		AI                    
	******************************************************** */

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
	}

	/* *******************************************************
		Actions Up                     
	******************************************************** */

	public onDateChange(event: number[]): void {
		const current = this.page_settings();
		const updated = {...current, date_start: event[0], date_end: event[1]};
		this.page_settings.set(updated);
		this.settingDeviceService.setMintDashboardSettings(updated);
		this.reloadDynamicData();
	}

	public onUnitsChange(event: MintUnit[]): void {
		const current = this.page_settings();
		const updated = {...current, units: event};
		this.page_settings.set(updated);
		this.settingDeviceService.setMintDashboardSettings(updated);
		this.reloadDynamicData();
	}

	public onIntervalChange(event: MintAnalyticsInterval): void {
		const current = this.page_settings();
		const updated = {...current, interval: event};
		this.page_settings.set(updated);
		this.settingDeviceService.setMintDashboardSettings(updated);
		this.reloadDynamicData();
	}

	public onOracleUsedChange(event: boolean): void {
		const current = this.page_settings();
		const updated = {...current, oracle_used: event};
		this.page_settings.set(updated);
		this.settingDeviceService.setMintDashboardSettings(updated);
	}

	public onChartTypeChange(key: ChartKey, type: ChartType): void {
		const current = this.page_settings();
		const updated = {
			...current,
			type: {...current.type, [key]: type},
		};
		this.page_settings.set(updated);
		this.settingDeviceService.setMintDashboardSettings(updated);
	}

	public onNavigate(route: string): void {
		this.router.navigate([`/${route}`]);
	}

	/* *******************************************************
		Tertiary Nav                      
	******************************************************** */

	public onTertiaryNavChange(event: string[]): void {
		const current = this.page_settings();
		const updated = {...current, tertiary_nav: event};
		this.page_settings.set(updated);
		this.settingDeviceService.setMintDashboardSettings(updated);
		this.updateTertiaryNav();
	}

	public onTertiaryNavSelect(event: string): void {
		this.scrollToChart(event as NavTertiary);
	}

	private updateTertiaryNav(): void {
		const tertiary_nav = this.page_settings()
			.tertiary_nav.map((area) => `"${area}"`)
			.join(' ');
		this.chart_container.nativeElement.style.gridTemplateAreas = `${tertiary_nav}`;
	}

	private scrollToChart(nav_item: NavTertiary) {
		const target_element = this.nav_elements.find((el) => el.nativeElement.classList.contains(nav_item));
		if (!target_element?.nativeElement) return;
		setTimeout(() => {
			target_element.nativeElement.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
				inline: 'nearest',
			});
		}, 5);
	}

	/* *******************************************************
		Clean Up                      
	******************************************************** */

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}
}
