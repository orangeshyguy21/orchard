/* Core Dependencies */
import { Injectable } from '@angular/core';
/* Application Dependencies */
import { ThemeService } from '@client/modules/settings/services/theme/theme.service';

@Injectable({
    providedIn: 'root'
})
export class ChartService {

    constructor(
        private themeService: ThemeService
    ) { }

    public getAssetColor(asset: string): { bg: string, border: string } {


        const color = this.themeService.getThemeColor(`--color-${asset}`);

    //         // asset colors
    // --orc-asset-btc: #f7931a;
    // --orc-asset-usd: #84B08D;
    // --orc-asset-eur: #8AAAD8;

        // this.qr_primary_color = this.themeService.getThemeColor('--mat-sys-surface') || '#000000';


        const asset_colors: Record<string, { bg: string, border: string }> = {
            'sat': { bg: 'rgba(247, 147, 26, 0.3)', border: 'rgb(247, 147, 26)' },
            'usd': { bg: 'rgba(132, 176, 141, 0.3)', border: 'rgb(132, 176, 141)' },
            'eur': { bg: 'rgba(138, 170, 216, 0.3)', border: 'rgb(138, 170, 216)' },
        };
        return asset_colors[asset] || { bg: 'rgba(54, 162, 235, 0.3)', border: 'rgb(54, 162, 235)' };
    }

}
