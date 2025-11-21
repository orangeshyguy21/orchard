/* Core Dependencies */
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnInit,
	computed,
	ViewChildren,
	ViewChild,
	QueryList,
	ElementRef,
	AfterViewInit,
} from '@angular/core';
/* Application Dependencies */
import {LocalStorageService} from '@client/modules/cache/services/local-storage/local-storage.service';
import {SettingDeviceService} from '@client/modules/settings/services/setting-device/setting-device.service';
import {AiService} from '@client/modules/ai/services/ai/ai.service';
import {EventService} from '@client/modules/event/services/event/event.service';
import {ConfigService} from '@client/modules/config/services/config.service';
import {EventData} from '@client/modules/event/classes/event-data.class';
import {Locale, Timezone, Theme, ThemeType, Model} from '@client/modules/cache/services/local-storage/local-storage.types';
import {AiModel} from '@client/modules/ai/classes/ai-model.class';
import {NonNullableSettingsDeviceSettings} from '@client/modules/settings/types/setting.types';
import {NavTertiaryItem} from '@client/modules/nav/types/nav-tertiary-item.type';
/* Native Dependencies */
import {SettingsCategory} from '@client/modules/settings/enums/category.enum';

enum NavTertiary {
	Location = 'nav1',
	Theme = 'nav2',
	AI = 'nav3',
}

@Component({
	selector: 'orc-settings-subsection-device',
	standalone: false,
	templateUrl: './settings-subsection-device.component.html',
	styleUrl: './settings-subsection-device.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSubsectionDeviceComponent implements OnInit, AfterViewInit {
	@ViewChildren('nav1,nav2,nav3') nav_elements!: QueryList<ElementRef>;
	@ViewChild('settings_container', {static: false}) settings_container!: ElementRef;

	public version: string;
	public enabled_ai: boolean;
	public locale: Locale | null = null;
	public timezone: Timezone | null = null;
	public theme: Theme | null = null;
	public model: Model | null = null;
	public ai_models: AiModel[] = [];
	public loading_static: boolean = true;
	public loading_ai: boolean = true;
	public error_ai: boolean = false;
	public category_filters: SettingsCategory[] = [
		SettingsCategory.Orchard,
		SettingsCategory.Bitcoin,
		SettingsCategory.Lightning,
		SettingsCategory.Mint,
		SettingsCategory.Ecash,
	];
	public cat_orchard = SettingsCategory.Orchard;
	public cat_local = SettingsCategory.Local;
	public page_settings!: NonNullableSettingsDeviceSettings;
	public tertiary_nav_items: Record<NavTertiary, NavTertiaryItem> = {
		[NavTertiary.Location]: {title: 'Location'},
		[NavTertiary.Theme]: {title: 'Theme'},
		[NavTertiary.AI]: {title: 'AI'},
	};
	public tertiary_nav = computed<string[]>(() => this.page_settings?.tertiary_nav || []);

	constructor(
		private localStorageService: LocalStorageService,
		private settingDeviceService: SettingDeviceService,
		private aiService: AiService,
		private eventService: EventService,
		private configService: ConfigService,
		private cdr: ChangeDetectorRef,
	) {
		this.version = this.configService.config.mode.version;
		this.enabled_ai = this.configService.config.ai.enabled;
	}

	/* *******************************************************
	   Initalization                      
	******************************************************** */

	ngOnInit(): void {
		this.page_settings = this.getPageSettings();
		this.locale = this.localStorageService.getLocale();
		this.timezone = this.localStorageService.getTimezone();
		this.theme = this.localStorageService.getTheme();
		this.model = this.localStorageService.getModel();
		this.loading_static = false;
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

	private getModels() {
		if (!this.enabled_ai) return;
		this.aiService.getAiModels().subscribe(
			(models: AiModel[]) => {
				this.ai_models = models;
				this.error_ai = false;
				this.loading_ai = false;
				this.cdr.detectChanges();
			},
			(error) => {
				console.error(error);
				this.error_ai = true;
				this.loading_ai = false;
				this.cdr.detectChanges();
			},
		);
	}

	/* *******************************************************
		Actions Up                     
	******************************************************** */

	public onUpdateFilters(filters: SettingsCategory[]) {
		this.category_filters = filters;
	}

	public onLocaleChange(locale: string | null) {
		this.eventService.registerEvent(new EventData({type: 'SAVING'}));
		this.localStorageService.setLocale({code: locale});
		this.settingDeviceService.setLocale();
		this.locale = this.localStorageService.getLocale();
		this.eventService.registerEvent(
			new EventData({
				type: 'SUCCESS',
				message: 'Locale updated!',
			}),
		);
	}

	public onTimezoneChange(timezone: string | null) {
		this.eventService.registerEvent(new EventData({type: 'SAVING'}));
		this.localStorageService.setTimezone({tz: timezone});
		this.settingDeviceService.setTimezone();
		this.timezone = this.localStorageService.getTimezone();
		this.eventService.registerEvent(
			new EventData({
				type: 'SUCCESS',
				message: 'Timezone updated!',
			}),
		);
	}

	public onThemeChange(theme: ThemeType | null) {
		this.eventService.registerEvent(new EventData({type: 'SAVING'}));
		this.localStorageService.setTheme({type: theme});
		this.settingDeviceService.setTheme();
		this.theme = this.localStorageService.getTheme();
		this.eventService.registerEvent(
			new EventData({
				type: 'SUCCESS',
				message: 'Theme updated!',
			}),
		);
	}

	public onModelChange(model: string | null) {
		this.eventService.registerEvent(new EventData({type: 'SAVING'}));
		this.localStorageService.setModel({model: model});
		this.model = this.localStorageService.getModel();
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
		this.page_settings.tertiary_nav = event;
		this.settingDeviceService.setSettingsDeviceSettings(this.page_settings);
		this.updateTertiaryNav();
	}

	public onTertiaryNavSelect(event: string): void {
		this.scrollToSettings(event as NavTertiary);
	}

	private updateTertiaryNav(): void {
		const tertiary_nav = this.page_settings.tertiary_nav.map((area) => `"${area}"`).join(' ');
		this.settings_container.nativeElement.style.gridTemplateAreas = `${tertiary_nav}`;
	}

	private scrollToSettings(nav_item: NavTertiary) {
		const target_element = this.nav_elements.find((el) => el.nativeElement.classList.contains(nav_item));
		if (!target_element?.nativeElement) return;
		target_element.nativeElement.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
			inline: 'nearest',
		});
	}
}
