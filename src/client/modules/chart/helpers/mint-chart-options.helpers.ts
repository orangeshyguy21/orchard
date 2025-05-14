/* Vendor Dependencies */
import { TimeUnit, TimeScaleOptions } from 'chart.js';
import { DateTime } from 'luxon';
/* Shared Dependencies */
import { MintAnalyticsInterval } from '@shared/generated.types';

function getFiatAxisLabel(units: (string | undefined)[]): string {
    const has_usd = units.some(item => item === 'USD');
    const has_eur = units.some(item => item === 'EUR');
    if (has_usd && has_eur) return 'USD / EUR';
    if ( has_usd ) return 'USD';
    if ( has_eur ) return 'EUR';
    return 'FIAT';
}

function convertIntervalToTimeUnit(interval: MintAnalyticsInterval): TimeUnit {
    const interval_mapping: Record<MintAnalyticsInterval, TimeUnit> = {
      'day': 'day',
      'week': 'week',
      'month': 'month',
      'custom': 'day',
    };
    return interval_mapping[interval] || 'day';
}

function getTimeTicks(timestamp: number): string {
    return DateTime.fromMillis(timestamp).toLocaleString({
        month: 'short',
        day: 'numeric'
    }); 
}

export function getYAxis(units: (string | undefined)[]): string[] {
    const y_axis: string[] = [];
    if( units.includes('SAT') || units.includes('BTC') || units.includes('MSAT') ) {
        y_axis.push('ybtc');
    }
    if( units.includes('USD') || units.includes('EUR') ) {
        y_axis.push('yfiat');
    }
    return y_axis;
}

export function getTooltipTitle(tooltipItems: any): string {
    if (tooltipItems.length > 0) {
        return DateTime.fromMillis(tooltipItems[0].parsed.x)
            .toLocaleString({
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
    }
    return '';
}

export function getTooltipTitleExact(tooltipItems: any): string {
    if (tooltipItems.length > 0) {
        return DateTime.fromMillis(tooltipItems[0].parsed.x)
            .toLocaleString({
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
            });
    }
    return '';
}

export function getTooltipLabel(context: any, locale: string): string {
    const label = context.dataset.label || '';
    const value = context.parsed.y;
    return `${label}: ${value.toLocaleString(locale)}`;
}

export function getXAxisConfig(selected_interval: MintAnalyticsInterval, locale: string): any {
    const timeunit = convertIntervalToTimeUnit(selected_interval);
    return {
        type: 'time',
        time: {
            unit: timeunit,
            displayFormats: {
                day: 'short'
            },
            tooltipFormat: 'full'
        },
        adapters: {
            date: {
                locale: locale
            }
        },
        ticks: {
            source: 'data',
            callback: getTimeTicks
        },
        bounds: 'data',
        grid: {
            display: false
        }
    };
}

export function getBtcYAxisConfig({
    grid_color
}: {
    grid_color: string
}): any {
    return {
        position: 'left',
        title: {
            display: true,
            text: 'SATS'
        },
        beginAtZero: false,
        grid: {
            display: true, // Enable gridlines for ybtc axis
            color: grid_color
        },
    };
}

export function getFiatYAxisConfig({
    units,
    show_grid,
    grid_color
}: {
    units: (string | undefined)[],
    show_grid: boolean,
    grid_color: string
}): any {
    return {
        position: 'right',
        title: {
            display: true,
            text: getFiatAxisLabel(units)
        },
        beginAtZero: false,
        grid: {
            display: show_grid,
            color: grid_color
        },
    }
}

// const border_color = this.form_hot ? '#D5C4AC' : '#4c463d';
// const border_width = this.form_hot ? 2 : 1;
// const text_color = this.form_hot ? '#D5C4AC' : 'rgb(235, 225, 213)';
// const label_bg_color = this.form_hot ? '#695D49' : 'rgb(29, 27, 26)';
// const label_border_color = this.form_hot ? null : '#4c463d';

// export function getFormAnnotationConfig(hot: boolean): any {
//     if( hot ) return {
//         border_color: '#D5C4AC',
//         border_width: 2,
//         text_color: '#D5C4AC',
//         label_bg_color: '#695D49',
//         label_border_color: null
//     }
//     return {
//         border_color: '#4c463d',
//         border_width: 1,
//         text_color: 'rgb(235, 225, 213)',
//         label_bg_color: 'rgb(29, 27, 26)',
//         label_border_color: '#4c463d'
//     }
// }