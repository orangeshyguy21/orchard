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
/* Vendor Dependencies */
import {DateTime} from 'luxon';
import {Subscription} from 'rxjs';
/* Application Dependencies */
import {SettingDeviceService} from '@client/modules/settings/services/setting-device/setting-device.service';
import {EventService} from '@client/modules/event/services/event/event.service';
import {ConfigService} from '@client/modules/config/services/config.service';
import {NonNullableBitcoinOracleSettings} from '@client/modules/settings/types/setting.types';
import {EventData} from '@client/modules/event/classes/event-data.class';
/* Native Dependencies */
import {BitcoinService} from '@client/modules/bitcoin/services/bitcoin/bitcoin.service';
import {BitcoinOraclePrice} from '@client/modules/bitcoin/classes/bitcoin-oracle-price.class';
import {BackfillOracleControl} from '@client/modules/bitcoin/modules/bitcoin-subsection-oracle/types/backfill-oracle-control.type';
import {BitcoinOracleBackfillProgress} from '@client/modules/bitcoin/classes/bitcoin-oracle-backfill-progress.class';

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
	public data = signal<BitcoinOraclePrice[]>([]);
	public loading = signal<boolean>(true);
	public form_open = signal<boolean>(false);
	public date_today = signal<number>(Math.floor(DateTime.utc().startOf('day').toSeconds()));
	public enabled_ai = signal<boolean>(false);
	public backfill_active = signal<boolean>(false);
	public backfill_progress = signal<BitcoinOracleBackfillProgress | null>(null);
	public backfill_date_start = signal<number | null>(null);
	public backfill_date_end = signal<number | null>(null);

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
	) {
		effect(() => {
			const dirty = this.dirty_form();
			this.createPendingEvent(dirty);
		});
	}

	/* *******************************************************
	   Initalization                      
	******************************************************** */

	ngOnInit(): void {
		this.enabled_ai.set(this.configService.config.ai.enabled);
		this.subscriptions.add(this.getControlSubscription());
		this.subscriptions.add(this.getBackfillSubscription());
		this.subscriptions.add(this.getEventSubscription());
		this.subscriptions.add(this.getBackfillProgressSubscription());
		this.subscriptions.add(this.getBackfillActiveSubscription());
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

	private getBackfillSubscription(): Subscription {
		return this.backfill_form.valueChanges.subscribe(() => {
			if (this.backfill_form.invalid) return;
			if (this.backfill_form.get('date_start')?.value) {
				this.backfill_form.get('date_end')?.enable({emitEvent: false});
			} else {
				this.backfill_form.get('date_end')?.disable({emitEvent: false});
			}
			const backfill_date_start = Math.floor(this.backfill_form.get('date_start')?.value?.toUTC().startOf('day').toSeconds() ?? 0);
			const backfill_date_end = Math.floor(this.backfill_form.get('date_end')?.value?.toUTC().startOf('day').toSeconds() ?? 0);
			this.backfill_date_start.set(backfill_date_start);
			this.backfill_date_end.set(backfill_date_end === 0 ? null : backfill_date_end);
			const update_date_start = Math.min(backfill_date_start, this.page_settings.date_start);
			const update_date_end = Math.max(backfill_date_end, this.page_settings.date_end);
			if (update_date_start !== this.page_settings.date_start || update_date_end !== this.page_settings.date_end) {
				this.updateRange(update_date_start, update_date_end);
			}
			this.evaluateDirtyForm();
		});
	}

	private getEventSubscription(): Subscription {
		return this.eventService.getActiveEvent().subscribe((event_data: EventData | null) => {
			console.log('EVENT DATA:', event_data);
			this.active_event = event_data;
			if (event_data === null) this.evaluateDirtyForm();
			if (event_data && event_data.confirmed !== null) {
				event_data.confirmed ? this.submitBackfill() : this.eventUnconfirmed();
			}
		});
	}

	/**
	 * Subscribe to backfill progress updates
	 */
	private getBackfillProgressSubscription(): Subscription {
		return this.bitcoinService.backfill_progress$.subscribe((progress) => {
			console.log('BACKFILL PROGRESS:', progress);
			this.backfill_progress.set(progress);
			if (progress.status === 'completed') this.getOracleData();
			if (progress.status === 'error') {
				console.error('Backfill error:', progress.error);
				// Show error notification or update UI (TODO: Implement)
			}
		});
	}

	/**
	 * Subscribe to backfill active state
	 */
	private getBackfillActiveSubscription(): Subscription {
		return this.bitcoinService.backfill_active$.subscribe((active) => {
			this.backfill_active.set(active);
		});
	}

	/* *******************************************************
		Events                      
	******************************************************** */

	private eventUnconfirmed(): void {
		this.backfill_form.reset();
		this.backfill_form.get('date_end')?.disable({emitEvent: false});
		this.evaluateDirtyForm();
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
		this.backfill_form.get('date_start')?.setValue(DateTime.fromSeconds(date, {zone: 'utc'}));
		this.backfill_form.get('date_start')?.markAsDirty();
		this.backfill_form.get('date_start')?.markAsTouched();
		this.backfill_form.get('date_start')?.updateValueAndValidity();
		this.evaluateDirtyForm();
	}

	/* *******************************************************
		Form                  
	******************************************************** */

	private evaluateDirtyForm(): void {
		const dirty = this.backfill_form.get('date_start')?.dirty || this.backfill_form.get('date_end')?.dirty;
		this.dirty_form.set(dirty ?? false);
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
		this.backfill_form.reset();
		this.backfill_form.get('date_end')?.disable({emitEvent: false});
		this.backfill_date_start.set(null);
		this.backfill_date_end.set(null);
		this.eventService.registerEvent(null);
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

		// Mark form as pristine since we're submitting
		this.backfill_form.markAsPristine();
		this.dirty_form.set(false);
	}

	/**
	 * Cancel/abort the backfill process
	 */
	public abortBackfill(): void {
		this.bitcoinService.closeBackfillSocket();
		this.backfill_progress.set(null);
	}

	/* *******************************************************
		Destruction                      
	******************************************************** */

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
		if (this.backfill_active()) this.bitcoinService.closeBackfillSocket();
	}
}
