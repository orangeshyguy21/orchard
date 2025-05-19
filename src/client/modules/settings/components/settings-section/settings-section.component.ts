/* Core Dependencies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
/* Vendor Dependencies */
import { lastValueFrom } from 'rxjs';
/* Application Configuration */
import { environment } from '@client/configs/configuration';
/* Application Dependencies */
import { LocalStorageService } from '@client/modules/cache/services/local-storage/local-storage.service';
import { SettingService } from '@client/modules/settings/services/setting/setting.service';
import { AiService } from '@client/modules/ai/services/ai/ai.service';
import { Locale, Timezone, Theme, ThemeType, Model } from '@client/modules/cache/services/local-storage/local-storage.types';
import { AiModel } from '@client/modules/ai/classes/ai-model.class';
/* Native Dependencies */
import { SettingsCategory } from '@client/modules/settings/enums/category.enum';

@Component({
	selector: 'orc-settings-section',
	standalone: false,
	templateUrl: './settings-section.component.html',
	styleUrl: './settings-section.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsSectionComponent implements OnInit {

	public version = environment.mode.version;
	public locale: Locale | null = null;
	public timezone: Timezone | null = null;
	public theme: Theme | null = null;
	public model: Model | null = null;
	public ai_models: AiModel[] = [];
	public category_filters: SettingsCategory[] = [
		SettingsCategory.Orchard,
		SettingsCategory.Bitcoin,
		SettingsCategory.Lightning,
		SettingsCategory.Mint,
		SettingsCategory.Ecash
	];

	public loading_static: boolean = true;
	public loading_ai: boolean = true;
	public error_ai: boolean = false;

	constructor(
		private localStorageService: LocalStorageService,
		private settingService: SettingService,
		private aiService: AiService,
		private cdr: ChangeDetectorRef,
	) {}

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
		this.aiService.getAiModels()
			.subscribe((models:AiModel[]) => {
				this.ai_models = models;
				this.error_ai = false;
				this.loading_ai = false;
				this.cdr.detectChanges();
			}, (error) => {
				this.error_ai = true;
				this.loading_ai = false;
				this.cdr.detectChanges();
			}
		);
	}

	public onUpdateFilters(filters: SettingsCategory[]) {
		this.category_filters = filters;
	}

	public onLocaleChange(locale: string|null) {
		this.localStorageService.setLocale({ code: locale });
		this.settingService.setLocale();
		this.locale = this.localStorageService.getLocale();
	}

	public onTimezoneChange(timezone: string|null) {
		this.localStorageService.setTimezone({ tz: timezone });
		this.settingService.setTimezone();
		this.timezone = this.localStorageService.getTimezone();
	}

	public onThemeChange(theme: ThemeType|null) {
		this.localStorageService.setTheme({ type: theme });
		this.settingService.setTheme();
		this.theme = this.localStorageService.getTheme();
	}

	public onModelChange(model: string|null) {
		this.localStorageService.setModel({ model: model });
		this.model = this.localStorageService.getModel();
	}
}


