/* Core Dependencies */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
/* Application Dependencies */
import {LocalStorageService} from '@client/modules/cache/services/local-storage/local-storage.service';
import {SettingService} from '@client/modules/settings/services/setting/setting.service';
import {AiService} from '@client/modules/ai/services/ai/ai.service';
import {EventService} from '@client/modules/event/services/event/event.service';
import {ConfigService} from '@client/modules/config/services/config.service';
import {EventData} from '@client/modules/event/classes/event-data.class';
import {Locale, Timezone, Theme, ThemeType, Model} from '@client/modules/cache/services/local-storage/local-storage.types';
import {AiModel} from '@client/modules/ai/classes/ai-model.class';
/* Native Dependencies */
import {SettingsCategory} from '@client/modules/settings/enums/category.enum';

@Component({
	selector: 'orc-settings-subsection-dashboard',
	standalone: false,
	templateUrl: './settings-subsection-dashboard.component.html',
	styleUrl: './settings-subsection-dashboard.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSubsectionDashboardComponent implements OnInit {
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

	constructor(
		private localStorageService: LocalStorageService,
		private settingService: SettingService,
		private aiService: AiService,
		private eventService: EventService,
		private configService: ConfigService,
		private cdr: ChangeDetectorRef,
	) {
		this.version = this.configService.config.mode.version;
		this.enabled_ai = this.configService.config.ai.enabled;
	}

	ngOnInit(): void {
		this.locale = this.localStorageService.getLocale();
		this.timezone = this.localStorageService.getTimezone();
		this.theme = this.localStorageService.getTheme();
		this.model = this.localStorageService.getModel();
		this.loading_static = false;
		this.cdr.detectChanges();
		this.getModels();
	}

	private getModels() {
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

	public onUpdateFilters(filters: SettingsCategory[]) {
		this.category_filters = filters;
	}

	public onLocaleChange(locale: string | null) {
		this.eventService.registerEvent(new EventData({type: 'SAVING'}));
		this.localStorageService.setLocale({code: locale});
		this.settingService.setLocale();
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
		this.settingService.setTimezone();
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
		this.settingService.setTheme();
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
}
