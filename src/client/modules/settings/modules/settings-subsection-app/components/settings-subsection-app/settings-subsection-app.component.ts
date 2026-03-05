/* Core Dependencies */
import {
	ChangeDetectionStrategy,
	Component,
	HostListener,
	WritableSignal,
	signal,
	effect,
	inject,
	OnInit,
	AfterViewInit,
	OnDestroy,
	ElementRef,
	viewChild,
	viewChildren,
} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
/* Vendor Dependencies */
import {Subscription, firstValueFrom} from 'rxjs';
/* Application Dependencies */
import {ConfigService} from '@client/modules/config/services/config.service';
import {SettingAppService, ParsedAppSettings} from '@client/modules/settings/services/setting-app/setting-app.service';
import {SettingDeviceService} from '@client/modules/settings/services/setting-device/setting-device.service';
import {EventService} from '@client/modules/event/services/event/event.service';
import {BitcoinService} from '@client/modules/bitcoin/services/bitcoin/bitcoin.service';
import {EventData} from '@client/modules/event/classes/event-data.class';
import {OrchardErrors} from '@client/modules/error/classes/error.class';
import {BitcoinOraclePrice} from '@client/modules/bitcoin/classes/bitcoin-oracle-price.class';
import {DeviceType} from '@client/modules/layout/types/device.types';
import {NavTertiaryItem} from '@client/modules/nav/types/nav-tertiary-item.type';
import {NonNullableSettingsAppSettings} from '@client/modules/settings/types/setting.types';
/* Shared Dependencies */
import {SettingKey} from '@shared/generated.types';

enum NavTertiary {
	Bitcoin = 'nav1',
	AI = 'nav2',
}

@Component({
	selector: 'orc-settings-subsection-app',
	standalone: false,
	templateUrl: './settings-subsection-app.component.html',
	styleUrl: './settings-subsection-app.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSubsectionAppComponent implements OnInit, AfterViewInit, OnDestroy {
	private configService = inject(ConfigService);
	private settingAppService = inject(SettingAppService);
	private settingDeviceService = inject(SettingDeviceService);
	private eventService = inject(EventService);
	private bitcoinService = inject(BitcoinService);
	private breakpointObserver = inject(BreakpointObserver);

	readonly nav_elements = viewChildren<ElementRef>('nav1,nav2');
	readonly settings_container = viewChild<ElementRef>('settings_container');

	@HostListener('window:beforeunload')
	canDeactivate(): boolean {
		return this.active_event?.type !== 'PENDING';
	}

	public form_bitcoin: FormGroup = new FormGroup({
		oracle_enabled: new FormControl(false, [Validators.required]),
	});
	public bitcoin_enabled = this.configService.config.bitcoin.enabled;
	public bitcoin_oracle_price = signal<BitcoinOraclePrice | null>(null);
	public device_type = signal<DeviceType>('desktop');
	public page_settings = signal<NonNullableSettingsAppSettings | null>(null);

	readonly tertiary_nav_items: Record<NavTertiary, NavTertiaryItem> = {
		[NavTertiary.Bitcoin]: {title: 'Bitcoin'},
		[NavTertiary.AI]: {title: 'AI'},
	};

	private active_event: EventData | null = null;
	private subscriptions: Subscription = new Subscription();
	private dirty_count: WritableSignal<number> = signal(0);
	private initial_settings!: ParsedAppSettings;

	constructor() {
		effect(() => {
			this.createPendingEvent(this.dirty_count());
		});
	}

	ngOnInit(): void {
		this.subscriptions.add(this.getEventSubscription());
		this.subscriptions.add(this.getBreakpointSubscription());
		this.page_settings.set(this.getPageSettings());
		this.getSettings();
		this.getBitcoinOracle();
	}

	ngAfterViewInit(): void {
		this.updateTertiaryNav();
	}

	/* *******************************************************
		Settings
	******************************************************** */

	private getPageSettings(): NonNullableSettingsAppSettings {
		const settings = this.settingDeviceService.getSettingsAppSettings();
		return {
			tertiary_nav: settings.tertiary_nav ?? Object.values(NavTertiary),
		};
	}

	private getSettings(): void {
		this.initial_settings = this.settingAppService.getParsedSettings();
		this.initSettingForms(this.initial_settings);
	}

	private async getBitcoinOracle(): Promise<void> {
		const bitcoin_oracle_price = await firstValueFrom(this.bitcoinService.loadBitcoinOraclePrice());
		this.bitcoin_oracle_price.set(bitcoin_oracle_price);
	}

	/* *******************************************************
		Subscriptions
	******************************************************** */

	private getEventSubscription(): Subscription {
		return this.eventService.getActiveEvent().subscribe((event_data: EventData | null) => {
			this.active_event = event_data;
			if (event_data === null) this.evaluateDirtyCount();
			if (event_data && event_data.confirmed !== null) {
				event_data.confirmed ? this.onConfirmedEvent() : this.onUnconfirmedEvent();
			}
		});
	}

	private getBreakpointSubscription(): Subscription {
		return this.breakpointObserver.observe([Breakpoints.Large, Breakpoints.XLarge]).subscribe((result) => {
			this.device_type.set(result.matches ? 'desktop' : 'tablet');
		});
	}

	/* *******************************************************
		Forms
	******************************************************** */

	private initSettingForms(settings: ParsedAppSettings): void {
        console.log('initSettingForms', settings);
		this.form_bitcoin.patchValue({
			oracle_enabled: settings.bitcoin_oracle,
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
				this.getSettings();
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

	private onUnconfirmedEvent(): void {
		this.initSettingForms(this.initial_settings);
		this.form_bitcoin.get('oracle_enabled')?.markAsPristine();
		this.form_bitcoin.get('oracle_enabled')?.markAsUntouched();
		this.evaluateDirtyCount();
	}

	/* *******************************************************
		Tertiary Nav
	******************************************************** */

	public onTertiaryNavChange(event: string[]): void {
		this.page_settings.update((settings) => (settings ? {...settings, tertiary_nav: event} : null));
		const current = this.page_settings();
		if (current) this.settingDeviceService.setSettingsAppSettings(current);
		this.updateTertiaryNav();
	}

	public onTertiaryNavSelect(event: string): void {
		this.scrollToSettings(event as NavTertiary);
	}

	private updateTertiaryNav(): void {
		const settings = this.page_settings();
		const container = this.settings_container();
		if (!settings || !container) return;
		const tertiary_nav = settings.tertiary_nav.map((area) => `"${area}"`).join(' ');
		container.nativeElement.style.gridTemplateAreas = `${tertiary_nav}`;
	}

	private scrollToSettings(nav_item: NavTertiary): void {
		const target_element = this.nav_elements().find((el) => el.nativeElement.classList.contains(nav_item));
		if (!target_element?.nativeElement) return;
		target_element.nativeElement.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
			inline: 'nearest',
		});
	}

	/* *******************************************************
		Destroy
	******************************************************** */

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}
}
