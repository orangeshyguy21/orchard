/* Core Dependencies */
import {
	ChangeDetectionStrategy,
	Component,
	OnInit,
	OnDestroy,
	signal,
	computed,
	ViewChild,
	ElementRef,
	HostListener,
	effect,
} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
/* Vendor Dependencies */
import {DateTime} from 'luxon';
import {Subscription} from 'rxjs';
/* Application Dependencies */
import {SettingDeviceService} from '@client/modules/settings/services/setting-device/setting-device.service';
import {EventService} from '@client/modules/event/services/event/event.service';
import {ConfigService} from '@client/modules/config/services/config.service';
import {NonNullableBitcoinOracleSettings} from '@client/modules/settings/types/setting.types';
import {EventData} from '@client/modules/event/classes/event-data.class';
import {DeviceType} from '@client/modules/layout/types/device.types';
/* Native Dependencies */
import {BitcoinService} from '@client/modules/bitcoin/services/bitcoin/bitcoin.service';
import {BitcoinOraclePrice} from '@client/modules/bitcoin/classes/bitcoin-oracle-price.class';
import {BackfillOracleControl} from '@client/modules/bitcoin/modules/bitcoin-subsection-oracle/types/backfill-oracle-control.type';
import {BitcoinOracleBackfillProgress} from '@client/modules/bitcoin/classes/bitcoin-oracle-backfill-progress.class';
/* Shared Dependencies */
import {UtxOracleProgressStatus} from '@shared/generated.types';

@Component({
	selector: 'orc-bitcoin-subsection-oracle',
	standalone: false,
	templateUrl: './bitcoin-subsection-oracle.component.html',
	styleUrl: './bitcoin-subsection-oracle.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BitcoinSubsectionOracleComponent implements OnInit, OnDestroy {
	@HostListener('window:beforeunload')
	canDeactivate(): boolean {
		return this.active_event?.type !== 'PENDING';
	}

	@ViewChild('backfill_form_target', {static: false}) backfill_form_target!: ElementRef;

	public page_settings!: NonNullableBitcoinOracleSettings;
	public readonly control = new FormGroup({
		daterange: new FormGroup({
			date_start: new FormControl<DateTime | null>(null, [Validators.required]),
			date_end: new FormControl<DateTime | null>(null, [Validators.required]),
		}),
	});
	public readonly backfill_form = new FormGroup({
		date_start: new FormControl<DateTime | null>(null, [Validators.required]),
		date_end: new FormControl<DateTime | null>({value: null, disabled: true}),
	});
	public locale = signal<string>('');
	public data = signal<BitcoinOraclePrice[]>([]);
	public loading = signal<boolean>(true);
	public form_open = signal<boolean>(false);
	public date_today = signal<number>(Math.floor(DateTime.utc().startOf('day').toSeconds()));
	public enabled_ai = signal<boolean>(false);
	public backfill_running = signal<boolean>(false);
	public backfill_progress = signal<BitcoinOracleBackfillProgress | null>(null);
	public backfill_date_start = signal<number | null>(null);
	public backfill_date_end = signal<number | null>(null);
	public min_date = signal<DateTime>(DateTime.utc(2020, 7, 27).startOf('day')); // First valid date: July 27th, 2020 UTC
	public max_date = signal<DateTime>(DateTime.utc().endOf('day')); // Current date: today UTC
	public date_start_max = signal<DateTime>(this.max_date());
	public date_end_min = signal<DateTime>(this.min_date());
	public device_type = signal<DeviceType>('desktop');

	public latest_oracle = computed(() => {
		return this.data().length > 0 ? (this.data().at(-1) ?? null) : null;
	});

	private dirty_form = signal<boolean>(false);
	private active_event: EventData | null = null;
	private subscriptions: Subscription = new Subscription();

	constructor(
		private bitcoinService: BitcoinService,
		private settingDeviceService: SettingDeviceService,
		private eventService: EventService,
		private configService: ConfigService,
		private breakpointObserver: BreakpointObserver,
	) {
		effect(() => {
			const dirty = this.dirty_form();
			this.createPendingEvent(dirty);
		});
		effect(() => {
			const backfill_running = this.backfill_running();
			if (backfill_running) {
				this.backfill_form.get('date_start')?.disable({emitEvent: false});
				this.backfill_form.get('date_end')?.disable({emitEvent: false});
			}
		});
	}

	/* *******************************************************
	   Initalization                      
	******************************************************** */

	ngOnInit(): void {
		this.enabled_ai.set(this.configService.config.ai.enabled);
		this.locale.set(this.settingDeviceService.getLocale());
		this.subscriptions.add(this.getControlSubscription());
		this.subscriptions.add(this.getBackfillSubscription());
		this.subscriptions.add(this.getEventSubscription());
		this.subscriptions.add(this.getBackfillProgressSubscription());
		this.subscriptions.add(this.getBackfillActiveSubscription());
		this.subscriptions.add(this.getBreakpointSubscription());
		this.page_settings = this.getPageSettings();
		this.initializeControl();
		this.getOracleData();
	}

	private getPageSettings(): NonNullableBitcoinOracleSettings {
		const settings = this.settingDeviceService.getBitcoinOracleSettings();
		return {
			date_start: settings.date_start ?? Math.floor(DateTime.utc().minus({days: 14}).startOf('day').toSeconds()),
			date_end: settings.date_end ?? Math.floor(DateTime.utc().startOf('day').toSeconds()),
		};
	}

	private initializeControl(): void {
		const date_end_converted = DateTime.fromSeconds(this.page_settings.date_end, {zone: 'utc'}).toUTC();
		const date_start_converted = DateTime.fromSeconds(this.page_settings.date_start, {zone: 'utc'}).toUTC();
		this.control.get('daterange')?.get('date_start')?.setValue(date_start_converted);
		this.control.get('daterange')?.get('date_end')?.setValue(date_end_converted);
	}

	/* *******************************************************
		Subscriptions                      
	******************************************************** */

	private getControlSubscription(): Subscription {
		return this.control.valueChanges.subscribe(() => {
			if (this.control.invalid) return;
			const new_date_start = Math.floor(
				this.control.get('daterange')?.get('date_start')?.value?.toUTC().startOf('day').toSeconds() ?? 0,
			);
			const new_date_end = Math.floor(this.control.get('daterange')?.get('date_end')?.value?.toUTC().startOf('day').toSeconds() ?? 0);
			if (new_date_start === this.page_settings.date_start && new_date_end === this.page_settings.date_end) return;
			this.updateRange(new_date_start, new_date_end);
		});
	}

	/**
	 * Subscribe to backfill form changes and handle:
	 * - Date boundary calculations
	 * - Form state management (enable/disable end date)
	 * - Signal updates for backfill dates
	 * - Chart range expansion if needed
	 */
	private getBackfillSubscription(): Subscription {
		return this.backfill_form.valueChanges.subscribe(() => {
			this.calculateDateStartMax();
			this.calculateDateEndMin();
			this.handleBackfillFormState();
			const timestamps = this.extractBackfillTimestamps();
			this.backfill_date_start.set(timestamps.start);
			this.backfill_date_end.set(timestamps.end);
			this.evaluateDirtyForm();
			this.expandChartRangeIfNeeded(timestamps);
		});
	}

	private getEventSubscription(): Subscription {
		return this.eventService.getActiveEvent().subscribe((event_data: EventData | null) => {
			this.active_event = event_data;
			if (event_data === null) this.evaluateDirtyForm();
			if (event_data && event_data.confirmed !== null) {
				if (event_data.type === 'SUBSCRIBED') {
					if (event_data.confirmed === false) this.abortBackfill();
				} else {
					event_data.confirmed ? this.submitBackfill() : this.eventUnconfirmed();
				}
			}
		});
	}

	/**
	 * Subscribe to backfill progress updates
	 */
	private getBackfillProgressSubscription(): Subscription {
		return this.bitcoinService.backfill_progress$.subscribe((progress) => {
			this.backfill_progress.set(progress);
			if (progress.price !== null) this.getOracleData();
			if (progress.status === UtxOracleProgressStatus.Started) {
				this.eventService.registerEvent(
					new EventData({
						type: 'SUBSCRIBED',
						progress: 0,
					}),
				);
			}
			if (progress.status === UtxOracleProgressStatus.Processing) {
				this.eventService.registerEvent(
					new EventData({
						type: 'SUBSCRIBED',
						progress: progress.overall_progress ?? 0,
					}),
				);
			}
			if (progress.status === UtxOracleProgressStatus.Error) {
				console.error('Backfill error:', progress.error);
				this.eventService.registerEvent(
					new EventData({
						type: 'ERROR',
						message: 'Backfill error',
					}),
				);
			}
			if (progress.status === UtxOracleProgressStatus.Completed) {
				this.eventService.registerEvent(
					new EventData({
						type: 'SUCCESS',
						message: 'Backfill completed!',
					}),
				);
			}
		});
	}

	/**
	 * Subscribe to backfill active state
	 */
	private getBackfillActiveSubscription(): Subscription {
		return this.bitcoinService.backfill_active$.subscribe((active) => {
			this.backfill_running.set(active);
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
		Events                      
	******************************************************** */

	/**
	 * Submit the backfill form and start the backfill process
	 */
	public submitBackfill(): void {
		if (this.backfill_form.invalid) return;
		const date_start = this.backfill_form.get('date_start')?.value;
		const date_end = this.backfill_form.get('date_end')?.value;
		if (!date_start) return;
		const start_timestamp = Math.floor(date_start.toUTC().startOf('day').toSeconds());
		const end_timestamp = date_end ? Math.floor(date_end.toUTC().startOf('day').toSeconds()) : null;
		this.bitcoinService.openBackfillSocket(start_timestamp, end_timestamp);
		this.backfill_form.markAsPristine();
		this.dirty_form.set(false);
	}

	private eventUnconfirmed(): void {
		this.backfill_form.reset();
		this.backfill_form.get('date_end')?.disable({emitEvent: false});
		this.form_open.set(false);
		this.evaluateDirtyForm();
	}

	private abortBackfill(): void {
		this.bitcoinService.abortBackfillSocket();
		this.backfill_progress.set(null);
		this.eventService.registerEvent(null);
	}

	/* *******************************************************
	   Data              
	******************************************************** */

	private getOracleData(): void {
		this.bitcoinService.getBitcoinOraclePriceRange(this.page_settings.date_start, this.page_settings.date_end).subscribe({
			next: (data) => {
				this.data.set(data);
				this.loading.set(false);
			},
			error: (error) => {
				console.error('Error fetching oracle data:', error);
				this.loading.set(false);
				// Handle error appropriately (show notification, update UI, etc.)
			},
		});
	}

	private updateRange(date_start: number, date_end: number): void {
		this.page_settings.date_start = date_start;
		this.page_settings.date_end = date_end;
		this.settingDeviceService.setBitcoinOracleSettings(this.page_settings);
		this.loading.set(true);
		this.getOracleData();
	}

	/* *******************************************************
		Actions Up                     
	******************************************************** */

	public onBackfill(): void {
		!this.form_open() ? this.openForm() : this.onCloseForm();
	}

	public onBackfillDate(date: number): void {
		this.openForm();
		const date_start_value = this.backfill_form.get('date_start')?.value;
		const date_start_timestamp = date_start_value ? Math.floor(date_start_value.toUTC().startOf('day').toSeconds()) : null;
		if (date_start_timestamp === null) {
			this.backfill_form.get('date_start')?.setValue(DateTime.fromSeconds(date, {zone: 'utc'}));
			this.backfill_form.get('date_start')?.markAsDirty();
			this.backfill_form.get('date_start')?.markAsTouched();
			this.backfill_form.get('date_start')?.updateValueAndValidity();
			this.evaluateDirtyForm();
			return;
		}
		if (date < date_start_timestamp) {
			this.backfill_form.get('date_start')?.setValue(DateTime.fromSeconds(date, {zone: 'utc'}));
			this.backfill_form.get('date_start')?.markAsDirty();
			this.backfill_form.get('date_start')?.markAsTouched();
			this.backfill_form.get('date_start')?.updateValueAndValidity();
			this.backfill_form.get('date_end')?.setValue(null);
			this.evaluateDirtyForm();
			return;
		}
		this.backfill_form.get('date_end')?.setValue(DateTime.fromSeconds(date, {zone: 'utc'}));
		this.backfill_form.get('date_end')?.markAsDirty();
		this.backfill_form.get('date_end')?.markAsTouched();
		this.backfill_form.get('date_end')?.updateValueAndValidity();
		this.evaluateDirtyForm();
	}

	/* *******************************************************
		Form                  
	******************************************************** */

	private evaluateDirtyForm(): void {
		const dirty = this.backfill_form.get('date_start')?.dirty || this.backfill_form.get('date_end')?.dirty;
		this.dirty_form.set(dirty ?? false);
	}

	private calculateDateStartMax(): void {
		const date_end_value = this.backfill_form.get('date_end')?.value;
		if (date_end_value) {
			const day_before = date_end_value.minus({days: 1});
			this.date_start_max.set(day_before < this.max_date() ? day_before : this.max_date());
		} else {
			this.date_start_max.set(this.max_date());
		}
	}

	private calculateDateEndMin(): void {
		const date_start_value = this.backfill_form.get('date_start')?.value;
		if (date_start_value) {
			const day_after = date_start_value.plus({days: 1});
			this.date_end_min.set(day_after > this.min_date() ? day_after : this.min_date());
		} else {
			this.date_end_min.set(this.min_date());
		}
	}

	private openForm(): void {
		this.form_open.set(true);
		this.backfill_form_target.nativeElement.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
			inline: 'nearest',
		});
	}

	public onCloseForm(): void {
		this.form_open.set(false);
		if (!this.backfill_running()) {
			this.backfill_form.reset();
			this.backfill_form.get('date_start')?.enable({emitEvent: false});
			this.backfill_form.get('date_end')?.disable({emitEvent: false});
			this.backfill_date_start.set(null);
			this.backfill_date_end.set(null);
			this.eventService.registerEvent(null);
			this.backfill_progress.set(null);
		} else {
			this.abortBackfill();
		}
	}

	public onCancelForm(control_name: BackfillOracleControl): void {
		this.backfill_form.get(control_name)?.reset();
		this.backfill_form.get(control_name)?.markAsPristine();
		this.backfill_form.get(control_name)?.markAsUntouched();
		this.backfill_form.get(control_name)?.updateValueAndValidity();
		this.evaluateDirtyForm();
	}

	private createPendingEvent(dirty: boolean): void {
		if (!dirty && this.active_event?.type !== 'PENDING') return;
		if (!dirty) return this.eventService.registerEvent(null);
		const message = 'Backfill';
		this.eventService.registerEvent(
			new EventData({
				type: 'PENDING',
				message: message,
			}),
		);
	}

	/**
	 * Enable/disable the end date field based on whether start date is set
	 */
	private handleBackfillFormState(): void {
		const has_start_date = !!this.backfill_form.get('date_start')?.value;
		const date_end_control = this.backfill_form.get('date_end');
		if (has_start_date) {
			date_end_control?.enable({emitEvent: false});
		} else {
			date_end_control?.disable({emitEvent: false});
		}
	}

	/**
	 * Extract DateTime values from form and convert to Unix timestamps
	 * @returns {object} Object with start and end timestamps (or null)
	 */
	private extractBackfillTimestamps(): {start: number | null; end: number | null} {
		const date_start_value = this.backfill_form.get('date_start')?.value;
		const date_end_value = this.backfill_form.get('date_end')?.value;
		return {
			start: date_start_value ? Math.floor(date_start_value.toUTC().startOf('day').toSeconds()) : null,
			end: date_end_value ? Math.floor(date_end_value.toUTC().startOf('day').toSeconds()) : null,
		};
	}

	/**
	 * Expand the chart date range if backfill dates extend beyond current view
	 * @param {object} timestamps - The backfill start and end timestamps
	 */
	private expandChartRangeIfNeeded(timestamps: {start: number | null; end: number | null}): void {
		if (timestamps.start === null) return;
		const new_start = Math.min(timestamps.start, this.page_settings.date_start);
		const new_end = Math.max(
			timestamps.end ?? timestamps.start, // If no end date, use start date
			this.page_settings.date_end,
		);
		const range_changed = new_start !== this.page_settings.date_start || new_end !== this.page_settings.date_end;
		if (range_changed) this.updateRange(new_start, new_end);
	}

	/* *******************************************************
		Destruction                      
	******************************************************** */

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
		if (this.backfill_running()) this.bitcoinService.abortBackfillSocket();
	}
}
