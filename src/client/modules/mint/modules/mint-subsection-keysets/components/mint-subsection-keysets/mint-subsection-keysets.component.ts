/* Core Dependencies */
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnInit,
	OnDestroy,
	HostListener,
	ViewChild,
	ElementRef,
	signal,
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
/* Vendor Dependencies */
import {lastValueFrom, forkJoin, Subscription} from 'rxjs';
import {DateTime} from 'luxon';
/* Application Dependencies */
import {ConfigService} from '@client/modules/config/services/config.service';
import {SettingDeviceService} from '@client/modules/settings/services/setting-device/setting-device.service';
import {EventService} from '@client/modules/event/services/event/event.service';
import {AiService} from '@client/modules/ai/services/ai/ai.service';
import {EventData} from '@client/modules/event/classes/event-data.class';
import {AiChatToolCall} from '@client/modules/ai/classes/ai-chat-chunk.class';
import {NonNullableMintKeysetsSettings} from '@client/modules/settings/types/setting.types';
import {ComponentCanDeactivate} from '@client/modules/routing/interfaces/routing.interfaces';
import {OrchardErrors} from '@client/modules/error/classes/error.class';
import {DeviceType} from '@client/modules/layout/types/device.types';
/* Native Dependencies */
import {MintService} from '@client/modules/mint/services/mint/mint.service';
import {MintKeyset} from '@client/modules/mint/classes/mint-keyset.class';
import {MintBalance} from '@client/modules/mint/classes/mint-balance.class';
import {MintAnalyticKeyset} from '@client/modules/mint/classes/mint-analytic.class';
import {MintKeysetProofCount} from '@client/modules/mint/classes/mint-keyset-proof-count.class';
/* Shared Dependencies */
import {MintUnit, MintAnalyticsInterval, AiFunctionName, AiAgent} from '@shared/generated.types';

@Component({
	selector: 'orc-mint-subsection-keysets',
	standalone: false,
	templateUrl: './mint-subsection-keysets.component.html',
	styleUrl: './mint-subsection-keysets.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionKeysetsComponent implements ComponentCanDeactivate, OnInit, OnDestroy {
	@HostListener('window:beforeunload')
	canDeactivate(): boolean {
		return this.active_event?.type !== 'PENDING';
	}

	@ViewChild('keyset_form', {static: false}) keyset_form!: ElementRef;

	public mint_keysets: MintKeyset[] = [];
	public locale!: string;
	public interval!: MintAnalyticsInterval;
	public mint_genesis_time: number = 0;
	public page_settings!: NonNullableMintKeysetsSettings;
	public loading_static_data: boolean = true;
	public loading_dynamic_data: boolean = true;
	public keysets_analytics: MintAnalyticKeyset[] = [];
	public keysets_analytics_pre: MintAnalyticKeyset[] = [];
	public keysets_proof_counts: MintKeysetProofCount[] = [];
	public keysets_rotation: boolean = false;
	public unit_options!: {value: string; label: string}[];
	public keyset_out!: MintKeyset;
	public keyset_out_balance!: MintBalance;
	public median_notes!: number;
	public form_keyset: FormGroup = new FormGroup({
		unit: new FormControl(null, [Validators.required]),
		input_fee_ppk: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(100000)]),
		max_order: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(255)]),
	});
	public device_type = signal<DeviceType>('desktop');

	private active_event: EventData | null = null;
	private subscriptions: Subscription = new Subscription();

	constructor(
		public route: ActivatedRoute,
		private configService: ConfigService,
		private settingDeviceService: SettingDeviceService,
		private eventService: EventService,
		private aiService: AiService,
		private mintService: MintService,
		private cdr: ChangeDetectorRef,
		private breakpointObserver: BreakpointObserver,
	) {}

	/* *******************************************************
	   Initalization                      
	******************************************************** */

	ngOnInit(): void {
		this.mint_keysets = this.route.snapshot.data['mint_keysets'];
		this.unit_options = this.getUnitOptions();
		this.resetForm();
		this.initKeysetsAnalytics();
		this.subscriptions.add(this.getEventSubscription());
		this.subscriptions.add(this.getBreakpointSubscription());
		this.orchardOptionalInit();
	}

	orchardOptionalInit(): void {
		if (this.configService.config.ai.enabled) {
			this.subscriptions.add(this.getAgentSubscription());
			this.subscriptions.add(this.getToolSubscription());
		}
	}

	private getUnitOptions(): {value: string; label: string}[] {
		const possible_units = Array.from(new Set(this.mint_keysets.map((keyset) => keyset.unit)));
		return possible_units.map((unit) => ({value: unit, label: unit.toUpperCase()}));
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

	private getEventSubscription(): Subscription {
		return this.eventService.getActiveEvent().subscribe((event_data: EventData | null) => {
			this.active_event = event_data;
			if (event_data === null) {
				setTimeout(() => {
					if (!this.keysets_rotation) return;
					this.eventService.registerEvent(
						new EventData({
							type: 'PENDING',
							message: 'Save',
						}),
					);
				}, 1000);
			}
			if (event_data) {
				if (event_data.type === 'SUCCESS') this.onSuccessEvent();
				if (event_data.confirmed !== null) event_data.confirmed ? this.onConfirmedEvent() : this.onCloseRotation();
			}
		});
	}

	private getAgentSubscription(): Subscription {
		return this.aiService.agent_requests$.subscribe(({agent, content}) => {
			this.keysets_rotation ? this.hireRotationAgent(AiAgent.MintKeysetRotation, content) : this.hireAnalyticsAgent(agent, content);
		});
	}

	private getToolSubscription(): Subscription {
		return this.aiService.tool_calls$.subscribe((tool_call: AiChatToolCall) => {
			this.executeAgentFunction(tool_call);
		});
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

	private async initKeysetsAnalytics(): Promise<void> {
		this.locale = this.settingDeviceService.getLocale();
		this.mint_genesis_time = this.getMintGenesisTime();
		this.page_settings = this.getPageSettings();
		this.interval = this.getAnalyticsInterval();
		const timezone = this.settingDeviceService.getTimezone();
		this.loading_static_data = false;
		this.cdr.detectChanges();
		await this.loadKeysetsAnalytics(timezone, this.interval);
		this.loading_dynamic_data = false;
		this.cdr.detectChanges();
	}

	private getAnalyticsInterval(): MintAnalyticsInterval {
		const days_diff = DateTime.fromSeconds(this.page_settings.date_end).diff(
			DateTime.fromSeconds(this.page_settings.date_start),
			'days',
		).days;
		if (days_diff <= 90) return MintAnalyticsInterval.Day;
		if (days_diff <= 365) return MintAnalyticsInterval.Week;
		return MintAnalyticsInterval.Month;
	}

	private async loadKeysetsAnalytics(timezone: string, interval: MintAnalyticsInterval): Promise<void> {
		const analytics_keysets_obs = this.mintService.loadMintAnalyticsKeysets({
			date_start: this.page_settings.date_start,
			date_end: this.page_settings.date_end,
			interval: interval,
			timezone: timezone,
		});
		const analytics_keysets_pre_obs = this.mintService.loadMintAnalyticsKeysets({
			date_start: 100000,
			date_end: this.page_settings.date_start - 1,
			interval: MintAnalyticsInterval.Custom,
			timezone: timezone,
		});
		const keyset_proof_counts_obs = this.mintService.loadMintKeysetProofCounts({
			date_start: this.page_settings.date_start,
			date_end: this.page_settings.date_end,
			id_keysets: this.mint_keysets.map((keyset) => keyset.id),
		});

		const [analytics_keysets, analytics_keysets_pre, keysets_proof_counts] = await lastValueFrom(
			forkJoin([analytics_keysets_obs, analytics_keysets_pre_obs, keyset_proof_counts_obs]),
		);

		this.keysets_analytics = analytics_keysets;
		this.keysets_analytics_pre = analytics_keysets_pre;
		this.keysets_proof_counts = keysets_proof_counts;
	}

	private async reloadDynamicData(): Promise<void> {
		try {
			this.mintService.clearKeysetsCache();
			this.loading_dynamic_data = true;
			this.cdr.detectChanges();
			this.interval = this.getAnalyticsInterval();
			const timezone = this.settingDeviceService.getTimezone();
			this.cdr.detectChanges();
			await this.loadKeysetsAnalytics(timezone, this.interval);
			this.loading_dynamic_data = false;
			this.cdr.detectChanges();
		} catch (error) {
			console.error('Error updating dynamic data:', error);
		}
	}

	private async getMintKeysetBalance(): Promise<void> {
		this.mintService.getMintKeysetBalance(this.keyset_out.id).subscribe((mint_balance) => {
			this.keyset_out_balance = mint_balance;
			this.cdr.detectChanges();
		});
	}

	private async getMintProofGroupStats(): Promise<void> {
		this.mintService.getMintProofGroupStats(this.keyset_out.unit).subscribe((stats) => {
			this.median_notes = stats.mint_proof_group_stats.median;
			this.cdr.detectChanges();
		});
	}

	/* *******************************************************
		Form                      
	******************************************************** */

	private resetForm(unit?: MintUnit): void {
		this.form_keyset.markAsPristine();
		const form_unit = unit ?? this.getDefaultUnit();
		const form_input_fee_ppk = this.getKeysetInputFeePpk(form_unit);
		const form_max_order = 32;
		this.keyset_out = this.getKeysetOut(form_unit);
		this.form_keyset.patchValue({
			unit: form_unit,
			input_fee_ppk: form_input_fee_ppk,
			max_order: form_max_order,
		});
	}

	private getDefaultUnit(): MintUnit {
		const possible_units = Array.from(new Set(this.mint_keysets.map((keyset) => keyset.unit)));
		if (possible_units.includes(MintUnit.Sat)) return MintUnit.Sat;
		return this.mint_keysets.reduce(
			(most_common_unit, keyset) => {
				const count = this.mint_keysets.filter((k) => k.unit === keyset.unit).length;
				return count > most_common_unit.count ? {unit: keyset.unit, count: count} : most_common_unit;
			},
			{unit: this.mint_keysets[0].unit, count: 0},
		).unit;
	}

	private getKeysetInputFeePpk(unit: MintUnit): number {
		const active_keyset = this.mint_keysets.find((keyset) => keyset.unit === unit && keyset.active);
		return active_keyset?.input_fee_ppk ?? 1000;
	}

	private getKeysetOut(unit: MintUnit): MintKeyset {
		return (
			this.mint_keysets
				.filter((keyset) => keyset.unit === unit && keyset.active)
				.sort((a, b) => a.valid_from - b.valid_from)
				.pop() ?? this.mint_keysets[0]
		);
	}

	private onConfirmedEvent(): void {
		if (this.form_keyset.invalid) {
			return this.eventService.registerEvent(
				new EventData({
					type: 'WARNING',
					message: 'Invalid keyset',
				}),
			);
		}
		this.eventService.registerEvent(new EventData({type: 'SAVING'}));
		const {unit, input_fee_ppk, max_order} = this.form_keyset.value;
		this.mintService.rotateMintKeysets(unit, input_fee_ppk, max_order).subscribe({
			next: () => {
				this.eventService.registerEvent(
					new EventData({
						type: 'SUCCESS',
						message: 'Rotation complete!',
					}),
				);
			},
			error: (errors: OrchardErrors) => {
				this.eventService.registerEvent(
					new EventData({
						type: 'ERROR',
						message: errors.errors[0].getFullError(),
					}),
				);
			},
		});
	}

	private async onSuccessEvent(): Promise<void> {
		this.keysets_rotation = false;
		this.cdr.detectChanges();
		this.mintService.clearKeysetsCache();
		const mint_keysets = await lastValueFrom(this.mintService.loadMintKeysets());
		this.mint_keysets = mint_keysets;
		this.resetForm();
		await this.reloadDynamicData();
	}

	private initKeysetsRotation(): void {
		this.keysets_rotation = true;
		this.eventService.registerEvent(
			new EventData({
				type: 'PENDING',
				message: 'Save',
			}),
		);
		this.keyset_form.nativeElement.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
			inline: 'nearest',
		});
		this.getMintKeysetBalance();
		this.getMintProofGroupStats();
	}

	/* *******************************************************
		Page Settings                      
	******************************************************** */

	private getPageSettings(): NonNullableMintKeysetsSettings {
		const settings = this.settingDeviceService.getMintKeysetsSettings();
		return {
			units: settings.units ?? [],
			date_start: settings.date_start ?? this.mint_genesis_time,
			date_end: settings.date_end ?? this.getSelectedDateEnd(),
			status: settings.status ?? [],
		};
	}

	private getSelectedDateEnd(): number {
		const today = DateTime.now().endOf('day');
		return Math.floor(today.toSeconds());
	}

	/* *******************************************************
		AI                     
	******************************************************** */

	private hireAnalyticsAgent(agent: AiAgent, content: string | null): void {
		let context = `* **Current Date:** ${DateTime.now().toFormat('yyyy-MM-dd')}\n`;
		context += `* **Date Start:** ${DateTime.fromSeconds(this.page_settings.date_start).toFormat('yyyy-MM-dd')}\n`;
		context += `* **Date End:** ${DateTime.fromSeconds(this.page_settings.date_end).toFormat('yyyy-MM-dd')}\n`;
		context += `* **Units:** ${this.page_settings.units}\n`;
		context += `* **Status:** ${this.page_settings.status}\n`;
		context += `* **Available Units:** ${this.unit_options.map((unit) => unit.value).join(', ')}\n`;
		this.aiService.openAiSocket(agent, content, context);
	}
	private hireRotationAgent(agent: AiAgent, content: string | null): void {
		let context = `* **Current Unit:** ${this.form_keyset.value.unit}\n`;
		context += `* **Input Fee PPK:** ${this.form_keyset.value.input_fee_ppk}\n`;
		context += `* **Max Order:** ${this.form_keyset.value.max_order}\n`;
		context += `* **Available Units:** ${this.unit_options.map((unit) => unit.value).join(', ')}\n`;
		this.aiService.openAiSocket(agent, content, context);
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
		if (tool_call.function.name === AiFunctionName.MintKeysetStatusUpdate) {
			const statuses =
				typeof tool_call.function.arguments.statuses === 'string'
					? JSON.parse(tool_call.function.arguments.statuses).map((status: any) => status === 'true' || status === true)
					: tool_call.function.arguments.statuses.map((status: any) => status === 'true' || status === true);
			this.onStatusChange(statuses);
		}
		if (tool_call.function.name === AiFunctionName.MintKeysetRotationUnitUpdate) {
			this.form_keyset.patchValue({
				unit: tool_call.function.arguments.unit,
			});
		}
		if (tool_call.function.name === AiFunctionName.MintKeysetRotationInputFeePpkUpdate) {
			this.form_keyset.patchValue({
				input_fee_ppk: tool_call.function.arguments.input_fee_ppk,
			});
		}
		if (tool_call.function.name === AiFunctionName.MintKeysetRotationMaxOrderUpdate) {
			this.form_keyset.patchValue({
				max_order: tool_call.function.arguments.max_order,
			});
		}
	}

	/* *******************************************************
		Actions Up                     
	******************************************************** */

	public onDateChange(event: number[]): void {
		this.page_settings.date_start = event[0];
		this.page_settings.date_end = event[1];
		this.settingDeviceService.setMintKeysetsSettings(this.page_settings);
		this.reloadDynamicData();
	}

	public onUnitsChange(event: MintUnit[]): void {
		this.page_settings.units = event;
		this.settingDeviceService.setMintKeysetsSettings(this.page_settings);
		this.reloadDynamicData();
	}

	public onStatusChange(event: boolean[]): void {
		this.page_settings.status = event;
		this.settingDeviceService.setMintKeysetsSettings(this.page_settings);
		this.reloadDynamicData();
	}

	public onRotation(): void {
		!this.keysets_rotation ? this.initKeysetsRotation() : this.onCloseRotation();
	}

	public onRotationUnit(unit: MintUnit): void {
		this.resetForm(unit);
		this.initKeysetsRotation();
	}

	public onCloseRotation(): void {
		this.keysets_rotation = false;
		this.eventService.registerEvent(null);
		this.cdr.detectChanges();
	}

	public onUpdateUnit(unit: MintUnit): void {
		this.keyset_out = this.getKeysetOut(unit);
		this.getMintKeysetBalance();
		this.cdr.detectChanges();
	}

	/* *******************************************************
		Clean Up                      
	******************************************************** */

	ngOnDestroy(): void {
		this.keysets_rotation = false;
		this.subscriptions.unsubscribe();
	}
}
