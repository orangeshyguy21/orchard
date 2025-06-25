/* Core Dependencies */
import { Injectable } from '@angular/core';
/* Vendor Dependencies */
import { Observable, Subject } from 'rxjs';
/* Application Dependencies */
import { DataType } from '@client/modules/orchard/enums/data.enum';
import { ThemeService } from '@client/modules/settings/services/theme/theme.service';
import { SettingService } from '@client/modules/settings/services/setting/setting.service';
/* Shared Dependencies */
import { MintQuoteState, MeltQuoteState } from '@shared/generated.types';

@Injectable({
    providedIn: 'root'
})
export class ChartService {

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
    private state_mint_map = {
        'UNPAID': 'triangle',
        'PAID': 'rect',
        'PENDING': 'rectRot',
        'ISSUED': 'circle'
    };
    private state_melt_map = {
        'UNPAID': 'triangle',
        'PENDING': 'rectRot',
        'PAID': 'circle'
    };
    private resize_start_subject = new Subject<void>();
    private resize_end_subject = new Subject<void>();

    constructor(
        private themeService: ThemeService,
        private settingService: SettingService,
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

    public getStatePointStyle(datatype: DataType, state: string|undefined): string {
        if( datatype === DataType.MintMints ) return this.state_mint_map[(state as MintQuoteState)] || 'circle';
        if( datatype === DataType.MintMelts ) return this.state_melt_map[(state as MeltQuoteState)] || 'circle';
        return 'circle';
    }

    public hexToRgba(hex: string, opacity: number): string {
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


    public triggerResizeStart(): void {
        this.resize_start_subject.next();
    }
    public triggerResizeEnd(): void {
        this.resize_end_subject.next();
    }
    public onResizeStart(): Observable<void> {
        return this.resize_start_subject.asObservable();
    }
    public onResizeEnd(): Observable<void> {
        return this.resize_end_subject.asObservable();
    }
}