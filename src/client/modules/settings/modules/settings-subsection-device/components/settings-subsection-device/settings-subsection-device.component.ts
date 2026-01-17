/* Core Dependencies */
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnInit,
	OnDestroy,
	computed,
	ElementRef,
	AfterViewInit,
	signal,
	viewChild,
	viewChildren,
} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
/* Vendor Dependencies */
import {Subscription} from 'rxjs';
/* Application Dependencies */
import {LocalStorageService} from '@client/modules/cache/services/local-storage/local-storage.service';
import {SettingDeviceService} from '@client/modules/settings/services/setting-device/setting-device.service';
import {AiService} from '@client/modules/ai/services/ai/ai.service';
import {EventService} from '@client/modules/event/services/event/event.service';
import {ConfigService} from '@client/modules/config/services/config.service';
import {EventData} from '@client/modules/event/classes/event-data.class';
import {
	Locale,
	Timezone,
	Theme,
	ThemeType,
	Model,
	Currency,
	CurrencyType,
} from '@client/modules/cache/services/local-storage/local-storage.types';
import {AiModel} from '@client/modules/ai/classes/ai-model.class';
import {NonNullableSettingsDeviceSettings} from '@client/modules/settings/types/setting.types';
import {NavTertiaryItem} from '@client/modules/nav/types/nav-tertiary-item.type';
import {DeviceType} from '@client/modules/layout/types/device.types';

enum NavTertiary {
	Location = 'nav1',
	Theme = 'nav2',
	Currency = 'nav3',
	AI = 'nav4',
}

@Component({
	selector: 'orc-settings-subsection-device',
	standalone: false,
	templateUrl: './settings-subsection-device.component.html',
	styleUrl: './settings-subsection-device.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSubsectionDeviceComponent implements OnInit, AfterViewInit, OnDestroy {
	readonly nav_elements = viewChildren<ElementRef>('nav1,nav2,nav3,nav4');
	readonly settings_container = viewChild<ElementRef>('settings_container');

	public version: string;
	public enabled_ai: boolean;
	readonly locale = signal<Locale | null>(null);
	readonly timezone = signal<Timezone | null>(null);
	readonly theme = signal<Theme | null>(null);
	readonly model = signal<Model | null>(null);
	readonly currency = signal<Currency | null>(null);
	readonly ai_models = signal<AiModel[]>([]);
	readonly loading_static = signal(true);
	readonly loading_ai = signal(true);
	readonly error_ai = signal(false);
	readonly page_settings = signal<NonNullableSettingsDeviceSettings | null>(null);
	readonly device_type = signal<DeviceType>('desktop');

	readonly tertiary_nav_items: Record<NavTertiary, NavTertiaryItem> = {
		[NavTertiary.Location]: {title: 'Location'},
		[NavTertiary.Theme]: {title: 'Theme'},
		[NavTertiary.Currency]: {title: 'Currency'},
		[NavTertiary.AI]: {title: 'AI'},
	};
	readonly tertiary_nav = computed<string[]>(() => this.page_settings()?.tertiary_nav || []);
	readonly currency_btc = computed<CurrencyType>(() => {
		const _currency = this.currency();
		const settings_currency = this.settingDeviceService.getCurrency();
		return settings_currency.type_btc;
	});
	readonly locale_display = computed<string>(() => {
		const _locale = this.locale();
		return this.settingDeviceService.getLocale();
	});

	private subscriptions: Subscription = new Subscription();

	constructor(
		private localStorageService: LocalStorageService,
		private settingDeviceService: SettingDeviceService,
		private aiService: AiService,
		private eventService: EventService,
		private configService: ConfigService,
		private breakpointObserver: BreakpointObserver,
		private cdr: ChangeDetectorRef,
	) {
		this.version = this.configService.config.mode.version;
		this.enabled_ai = this.configService.config.ai.enabled;
	}

	/* *******************************************************
	   Initalization
	******************************************************** */

	ngOnInit(): void {
		this.subscriptions.add(this.getBreakpointSubscription());
		this.page_settings.set(this.getPageSettings());
		this.locale.set(this.localStorageService.getLocale());
		this.timezone.set(this.localStorageService.getTimezone());
		this.theme.set(this.localStorageService.getTheme());
		this.model.set(this.localStorageService.getModel());
		this.currency.set(this.localStorageService.getCurrency());
		this.loading_static.set(false);
		this.cdr.detectChanges();
		this.orchardOptionalInit();
	}

	ngAfterViewInit(): void {
		this.updateTertiaryNav();
	}

	private orchardOptionalInit(): void {
		this.getModels();
	}

	private getPageSettings(): NonNullableSettingsDeviceSettings {
		const settings = this.settingDeviceService.getSettingsDeviceSettings();
		return {
			tertiary_nav: settings.tertiary_nav ?? Object.values(NavTertiary),
		};
	}

	private getModels(): void {
		if (!this.enabled_ai) return;
		this.aiService.getAiModels().subscribe({
			next: (models: AiModel[]) => {
				this.ai_models.set(models);
				this.error_ai.set(false);
				this.loading_ai.set(false);
				this.cdr.detectChanges();
			},
			error: (error) => {
				console.error(error);
				this.error_ai.set(true);
				this.loading_ai.set(false);
				this.cdr.detectChanges();
			},
		});
	}

	/* *******************************************************
		Subscriptions
	******************************************************** */

	private getBreakpointSubscription(): Subscription {
		return this.breakpointObserver.observe([Breakpoints.Large, Breakpoints.XLarge]).subscribe((result) => {
			this.device_type.set(result.matches ? 'desktop' : 'tablet');
		});
	}

	/* *******************************************************
		Actions Up
	******************************************************** */

	public onLocaleChange(locale: string | null): void {
		this.eventService.registerEvent(new EventData({type: 'SAVING'}));
		this.localStorageService.setLocale({code: locale});
		this.settingDeviceService.setLocale();
		this.locale.set(this.localStorageService.getLocale());
		this.eventService.registerEvent(
			new EventData({
				type: 'SUCCESS',
				message: 'Locale updated!',
			}),
		);
	}

	public onTimezoneChange(timezone: string | null): void {
		this.eventService.registerEvent(new EventData({type: 'SAVING'}));
		this.localStorageService.setTimezone({tz: timezone});
		this.settingDeviceService.setTimezone();
		this.timezone.set(this.localStorageService.getTimezone());
		this.eventService.registerEvent(
			new EventData({
				type: 'SUCCESS',
				message: 'Timezone updated!',
			}),
		);
	}

	public onThemeChange(theme: ThemeType | null): void {
		this.eventService.registerEvent(new EventData({type: 'SAVING'}));
		this.localStorageService.setTheme({type: theme});
		this.settingDeviceService.setTheme();
		this.theme.set(this.localStorageService.getTheme());
		this.eventService.registerEvent(
			new EventData({
				type: 'SUCCESS',
				message: 'Theme updated!',
			}),
		);
	}

	public onCurrencyChange(currency: CurrencyType | null, mode: keyof Currency): void {
		console.log(currency, mode);
		this.eventService.registerEvent(new EventData({type: 'SAVING'}));
		this.localStorageService.setCurrency({...this.localStorageService.getCurrency(), [mode]: currency});
		this.settingDeviceService.setCurrency();
		this.currency.set(this.localStorageService.getCurrency());
		this.eventService.registerEvent(
			new EventData({
				type: 'SUCCESS',
				message: 'Currency updated!',
			}),
		);
	}

	public onModelChange(model: string | null): void {
		this.eventService.registerEvent(new EventData({type: 'SAVING'}));
		this.localStorageService.setModel({model: model});
		this.model.set(this.localStorageService.getModel());
		this.eventService.registerEvent(
			new EventData({
				type: 'SUCCESS',
				message: 'Model updated!',
			}),
		);
	}

	/* *******************************************************
		Tertiary Nav
	******************************************************** */

	public onTertiaryNavChange(event: string[]): void {
		this.page_settings.update((settings) => (settings ? {...settings, tertiary_nav: event} : null));
		const current = this.page_settings();
		if (current) this.settingDeviceService.setSettingsDeviceSettings(current);
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

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}
}
