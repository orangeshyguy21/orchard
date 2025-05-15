/* Core Dependencies */
import { Injectable } from '@angular/core';
/* Application Dependencies */
import { ThemeService } from '@client/modules/settings/services/theme/theme.service';
import { SettingService } from '@client/modules/settings/services/setting/setting.service';
import { LocalStorageService } from '@client/modules/cache/services/local-storage/local-storage.service';
/* Local Dependencies */
import { AllMintDashboardSettings, AllMintKeysetsSettings } from './chart.types';

@Injectable({
    providedIn: 'root'
})
export class ChartService {

    public mint_dashboard_short_settings: Record<string, number | null> = {
        date_start: null,
        date_end: null,
    }
    public mint_keysets_short_settings: Record<string, number | null> = {
        date_start: null,
        date_end: null,
    }

    private asset_map: Record<string, string> = {
        'sat': '--orc-asset-btc',
        'usd': '--orc-asset-usd',
        'eur': '--orc-asset-eur',
    };
    private fallback_colors = [
        { bg: 'rgba(255, 253, 159, 0.15)', border: 'rgb(255, 253, 159)' },
        { bg: 'rgba(255, 214, 31, 0.15)', border: 'rgb(255, 214, 31)' },
        { bg: 'rgba(245, 143, 34, 0.15)', border: 'rgb(245, 143, 34)' },
        { bg: 'rgba(243, 101, 29, 0.15)', border: 'rgb(243, 101, 29)' },
        { bg: 'rgba(156, 34, 34, 0.15)', border: 'rgb(156, 34, 34)' }
    ];

    constructor(
        private themeService: ThemeService,
        private settingService: SettingService,
        private localStorageService: LocalStorageService
    ) { }

    public getAssetColor(asset: string, data_index: number): { bg: string, border: string } {
        const theme = this.settingService.getTheme();
        const asset_lower = asset.toLowerCase();
        const color_var = this.asset_map[asset_lower];
        if( color_var === undefined ) return this.fallback_colors[data_index % this.fallback_colors.length];
        const colorhex = this.themeService.getThemeColor(color_var, theme);
        const colorrgba = this.hexToRgba(colorhex, 0.15);
        return { bg: colorrgba, border: colorhex };
    }

    public getThemeColor(index: number): { bg: string, border: string } {
        return this.fallback_colors[index];
    }

    public getPointHoverBackgroundColor(): string {
        const theme = this.settingService.getTheme();
        const colorhex = this.themeService.getThemeColor('--mat-sys-surface', theme);
        return colorhex;
    }

    public getGridColor(token: string = '--mat-sys-surface-container'): string {
        const theme = this.settingService.getTheme();
        const colorhex = this.themeService.getThemeColor(token, theme);
        return colorhex;
    }

    public getAnnotationBorderColor(): string {
        const theme = this.settingService.getTheme();
        const colorhex = this.themeService.getThemeColor('--mat-sys-outline', theme);
        return colorhex;
    }

    public getMintDashboardSettings(): AllMintDashboardSettings {
        const long_term_settings = this.localStorageService.getMintDashboardSettings();
        return {
            ...long_term_settings,
            ...this.mint_dashboard_short_settings
        } as AllMintDashboardSettings;
    }
    
    public getMintKeysetsSettings(): AllMintKeysetsSettings {
        const long_term_settings = this.localStorageService.getMintKeysetsSettings();
        return {
            ...long_term_settings,
            ...this.mint_keysets_short_settings
        } as AllMintKeysetsSettings;
    }

    public getFormAnnotationConfig(hot: boolean): any {
        const theme = this.settingService.getTheme();
        if( hot ) return {
            border_color: this.themeService.getThemeColor('--mat-sys-primary', theme),
            border_width: 2,
            text_color: this.themeService.getThemeColor('--mat-sys-primary', theme),
            label_bg_color: this.themeService.getThemeColor('--mat-sys-inverse-primary', theme),
            label_border_color: this.themeService.getThemeColor('--mat-sys-surface-container-low', theme),
        }
        return {
            border_color: this.themeService.getThemeColor('--mat-sys-outline-variant', theme),
            border_width: 1,
            text_color: this.themeService.getThemeColor('--mat-sys-on-surface-variant', theme),
            label_bg_color: this.themeService.getThemeColor('--mat-sys-surface-container-low', theme),
            label_border_color: this.themeService.getThemeColor('--mat-sys-outline-variant', theme)
        }
    }

    /**
     * Converts a hex color string to an rgba color string with specified opacity
     */
    private hexToRgba(hex: string, opacity: number): string {
        hex = hex.replace('#', '');
        let r, g, b;
        if (hex.length === 3) {
            r = parseInt(hex.substring(0, 1).repeat(2), 16);
            g = parseInt(hex.substring(1, 2).repeat(2), 16);
            b = parseInt(hex.substring(2, 3).repeat(2), 16);
        } else {
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        }
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    public setMintDashboardShortSettings(settings: { date_start: number, date_end: number }): void {
        this.mint_dashboard_short_settings = settings;
    }
    public setMintDashboardSettings(settings: AllMintDashboardSettings): void {
        this.localStorageService.setMintDashboardSettings(settings);
    }
}