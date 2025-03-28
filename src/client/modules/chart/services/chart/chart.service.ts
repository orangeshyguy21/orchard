/* Core Dependencies */
import { Injectable } from '@angular/core';
/* Application Dependencies */
import { ThemeService } from '@client/modules/settings/services/theme/theme.service';
import { SettingService } from '@client/modules/settings/services/setting/setting.service';
import { LocalStorageService } from '@client/modules/cache/services/local-storage/local-storage.service';
import { MintChartSettings } from '@client/modules/cache/services/local-storage/local-storage.types';
/* Local Dependencies */
import { AllMintChartSettings } from './chart.types';

@Injectable({
    providedIn: 'root'
})
export class ChartService {

    public mint_chart_short_settings: Record<string, number | null> = {
        date_start: null,
        date_end: null,
    }

    private asset_map: Record<string, string> = {
        'sat': '--orc-asset-btc',
        'usd': '--orc-asset-usd',
        'eur': '--orc-asset-eur',
    };
    private fallback_colors = [
        { bg: 'rgba(255, 226, 122, 0.3)', border: 'rgb(255, 226, 122)' },
        { bg: 'rgba(249, 138, 86, 0.3)', border: 'rgb(249, 138, 86)' },
        { bg: 'rgba(198, 104, 104, 0.3)', border: 'rgb(198, 104, 104)' },
        { bg: 'rgba(246, 243, 160, 0.3)', border: 'rgb(246, 243, 160)' }
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

    public getPointHoverBackgroundColor(): string {
        const theme = this.settingService.getTheme();
        const colorhex = this.themeService.getThemeColor('--mat-sys-surface', theme);
        return colorhex;
    }

    public getGridColor(): string {
        const theme = this.settingService.getTheme();
        const colorhex = this.themeService.getThemeColor('--mat-sys-surface-container', theme);
        return colorhex;
    }

    public getMintChartSettings(): AllMintChartSettings {
        const long_term_settings = this.localStorageService.getMintChartSettings();
        return {
            ...long_term_settings,
            ...this.mint_chart_short_settings
        } as AllMintChartSettings;
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

    public setMintChartShortSettings(settings: { date_start: number, date_end: number }): void {
        this.mint_chart_short_settings = settings;
    }
    public setMintChartSettings(settings: AllMintChartSettings): void {
        this.localStorageService.setMintChartSettings(settings);
    }
}