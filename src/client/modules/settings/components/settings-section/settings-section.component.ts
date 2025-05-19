/* Core Dependencies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, signal, computed, model } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
/* Application Configuration */
import { environment } from '@client/configs/configuration';
/* Application Dependencies */
import { LocalStorageService } from '@client/modules/cache/services/local-storage/local-storage.service';
import { SettingService } from '@client/modules/settings/services/setting/setting.service';
import { AiService } from '@client/modules/ai/services/ai/ai.service';
import { Locale, Timezone, Theme, ThemeType } from '@client/modules/cache/services/local-storage/local-storage.types';
import { AiModel } from '@client/modules/ai/classes/ai-model.class';

@Component({
	selector: 'orc-settings-section',
	standalone: false,
	templateUrl: './settings-section.component.html',
	styleUrl: './settings-section.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsSectionComponent implements OnInit {

	public version = environment.mode.version;
	public loading: boolean = true;
	public locale: Locale | null = null;
	public timezone: Timezone | null = null;
	public theme: Theme | null = null;
	public ai_models: AiModel[] = [];


	readonly separatorKeysCodes: number[] = [ENTER, COMMA];
	public fruit_control = new FormControl('');
	readonly fruits = signal(['Orchard', 'Bitcoin', 'Lightning', 'Mint', 'Ecash', 'Local']);
	readonly allFruits: string[] = ['Orchard', 'Bitcoin', 'Lightning', 'Mint', 'Ecash'];
	readonly filteredFruits = computed(() => {
	  const currentFruit = this.fruit_control.value?.toLowerCase();
	  return currentFruit
		? this.allFruits.filter(fruit => fruit.toLowerCase().includes(currentFruit))
		: this.allFruits.slice();
	});

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
		this.getModels();
		this.loading = false;
		this.cdr.detectChanges();
	}

	private getModels() {
		this.aiService.getAiModels().subscribe((models) => {
			console.log('models', models);
		});
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
		console.log('theme change received', theme);
		this.localStorageService.setTheme({ type: theme });
		this.settingService.setTheme();
		this.theme = this.localStorageService.getTheme();
	}


	add(event: MatChipInputEvent): void {
		const value = (event.value || '').trim();
	
		// Add our fruit
		if (value) {
		  this.fruits.update(fruits => [...fruits, value]);
		}
	
		// Clear the input value
		this.fruit_control.setValue('');
	  }
	
	  remove(fruit: string): void {
		this.fruits.update(fruits => {
		  const index = fruits.indexOf(fruit);
		  if (index < 0) {
			return fruits;
		  }
	
		  fruits.splice(index, 1);

		  return [...fruits];
		});
	  }
	
	  selected(event: MatAutocompleteSelectedEvent): void {
		this.fruits.update(fruits => [...fruits, event.option.viewValue]);
		this.fruit_control.setValue('');
		event.option.deselect();
	  }
}