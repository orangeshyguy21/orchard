/* Core Dependencies */
import {ChangeDetectionStrategy, Component, HostListener, WritableSignal, signal, effect, OnInit, OnDestroy} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
/* Vendor Dependencies */
import {Subscription} from 'rxjs';
/* Application Dependencies */
import {SettingAppService} from '@client/modules/settings/services/setting-app/setting-app.service';
import {EventService} from '@client/modules/event/services/event/event.service';
import {EventData} from '@client/modules/event/classes/event-data.class';
import {OrchardErrors} from '@client/modules/error/classes/error.class';
/* Native Dependencies */
import {Setting} from '@client/modules/settings/classes/setting.class';
/* Shared Dependencies */
import {SettingKey} from '@shared/generated.types';

@Component({
	selector: 'orc-settings-subsection-app',
	standalone: false,
	templateUrl: './settings-subsection-app.component.html',
	styleUrl: './settings-subsection-app.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSubsectionAppComponent implements OnInit, OnDestroy {
	@HostListener('window:beforeunload')
	canDeactivate(): boolean {
		return this.active_event?.type !== 'PENDING';
	}

	public form_bitcoin: FormGroup = new FormGroup({
		oracle_enabled: new FormControl(false, [Validators.required]),
	});

	private active_event: EventData | null = null;
	private subscriptions: Subscription = new Subscription();
	private dirty_count: WritableSignal<number> = signal(0);
	private initial_settings: Setting[] = [];

	constructor(
		private settingAppService: SettingAppService,
		private eventService: EventService,
	) {
		effect(() => {
			this.createPendingEvent(this.dirty_count());
		});
	}

	ngOnInit(): void {
		this.subscriptions.add(this.getEventSubscription());
		this.getSettings();
	}

	private getSettings(): void {
		this.settingAppService.getSettings().subscribe((settings) => {
			this.initial_settings = settings;
			this.initSettingForms(settings);
		});
	}

	private getEventSubscription(): Subscription {
		return this.eventService.getActiveEvent().subscribe((event_data: EventData | null) => {
			this.active_event = event_data;
			if (event_data === null) this.evaluateDirtyCount();
			if (event_data && event_data.confirmed !== null) {
				event_data.confirmed ? this.onConfirmedEvent() : this.onUnconfirmedEvent();
			}
		});
	}

	private initSettingForms(settings: Setting[]): void {
		const bitcoin_oracle_setting = settings.find((setting) => setting.key === SettingKey.BitcoinOracle);
		if (!bitcoin_oracle_setting) return;
		this.form_bitcoin.patchValue({
			oracle_enabled: this.settingAppService.parseSettingValue(bitcoin_oracle_setting),
		});
	}

	public onUpdateBitcoinOracle(): void {
		this.evaluateDirtyCount();
	}

	private evaluateDirtyCount(): void {
		const contrtol_count = Object.keys(this.form_bitcoin.controls)
			.filter((key) => this.form_bitcoin.get(key) instanceof FormControl)
			.filter((key) => this.form_bitcoin.get(key)?.dirty).length;
		this.dirty_count.set(contrtol_count);
	}

	private createPendingEvent(count: number): void {
		if (count === 0 && this.active_event?.type !== 'PENDING') return;
		if (count === 0) return this.eventService.registerEvent(null);
		const message = count === 1 ? '1 update' : `${count} updates`;
		this.eventService.registerEvent(
			new EventData({
				type: 'PENDING',
				message: message,
			}),
		);
	}

	private onConfirmedEvent(): void {
		if (this.form_bitcoin.invalid) {
			return this.eventService.registerEvent(
				new EventData({
					type: 'WARNING',
					message: 'Invalid info',
				}),
			);
		}
		this.eventService.registerEvent(new EventData({type: 'SAVING'}));
		this.settingAppService.updateSetting(SettingKey.BitcoinOracle, this.form_bitcoin.value.oracle_enabled.toString()).subscribe({
			next: () => {
				this.eventService.registerEvent(
					new EventData({
						type: 'SUCCESS',
						message: 'Settings updated!',
					}),
				);
				this.form_bitcoin.markAsPristine();
				this.evaluateDirtyCount();
			},
			error: (error: OrchardErrors) => {
				console.error(error);
				this.eventService.registerEvent(
					new EventData({
						type: 'ERROR',
						message: error.errors[0].message,
					}),
				);
			},
		});
	}

	private onUnconfirmedEvent(): void {
		this.initSettingForms(this.initial_settings);
		this.form_bitcoin.get('oracle_enabled')?.markAsPristine();
		this.form_bitcoin.get('oracle_enabled')?.markAsUntouched();
		this.evaluateDirtyCount();
	}

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}
}
