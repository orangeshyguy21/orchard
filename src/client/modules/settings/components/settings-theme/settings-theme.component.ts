/* Core Dependencies */
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
/* Vendor Dependencies */
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
/* Application Dependencies */
import { Theme, ThemeType } from '@client/modules/cache/services/local-storage/local-storage.types';

@Component({
	selector: 'orc-settings-theme',
	standalone: false,
	templateUrl: './settings-theme.component.html',
	styleUrl: './settings-theme.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsThemeComponent {

	@Input() theme: Theme | null = null;
	@Input() loading!: boolean;

	@Output() themeChange = new EventEmitter<ThemeType|null>();

	public theme_control = new FormControl<boolean>(false);
	public system_default_control = new FormControl<boolean>(true);

	private system_theme = window.matchMedia('(prefers-color-scheme: light)').matches;

	constructor() { }

	ngOnChanges(changes: SimpleChanges): void {
		if(changes['loading'] && this.loading === false) this.init();
	}

	private init() {
		console.log('THEME VAL ON COMPONENT INIT', this.theme);
		if( this.theme === null ) return;
		this.initCheckbox(this.theme?.type);
		this.initTheme(this.theme?.type);
	}

	private initCheckbox(type: ThemeType|null) {
		const is_system_default = (type === null) ? true : false;
		this.system_default_control.setValue(is_system_default);
	}

	private initTheme(type: ThemeType|null) {
		const display_type = (type === null) ? this.system_theme : this.translateThemeToChecked(type);
		this.theme_control.setValue(display_type);
	}
	public onThemeChange(event: MatSlideToggleChange) {
		const value = this.translateCheckedToTheme(event.checked);
		this.themeChange.emit(value);
		if( event.checked !== this.system_theme ) return this.system_default_control.setValue(false);
	}


	public onSystemDefaultChange(event: MatCheckboxChange) {
		if( event.checked ) {
			this.themeChange.emit(null);
			this.theme_control.setValue(this.system_theme, { emitEvent: false });
		}else{
			if( this.theme_control.value === null ) return;
			const type = this.translateCheckedToTheme(this.theme_control.value);
			this.themeChange.emit(type);
		}
	}

	private translateThemeToChecked(type: ThemeType): boolean {
		return type === ThemeType.LIGHT_MODE;
	}

	private translateCheckedToTheme(checked: boolean): ThemeType {
		return checked ? ThemeType.LIGHT_MODE : ThemeType.DARK_MODE;
	}

}

// locale ex
// public onSystemDefaultChange(event: MatCheckboxChange) {
// 	if( event.checked ) {
// 		this.localeChange.emit(null);
// 		this.locale_control.setValue(navigator.language, { emitEvent: false });
// 	}else{
// 		this.localeChange.emit(this.locale_control.value);
// 	}
// }

