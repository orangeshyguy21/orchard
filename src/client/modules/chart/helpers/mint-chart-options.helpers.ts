/* Vendor Dependencies */
import { ChartConfiguration, TimeUnit, ScaleOptionsByType, CartesianScaleTypeRegistry, CategoryScale } from 'chart.js';
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

export function getTooltipLabel(context: any, locale: string): string {
    const label = context.dataset.label || '';
    const value = context.parsed.y;
    return `${label}: ${value.toLocaleString(locale)}`;
}

//             .toLocaleString({
//                 year: 'numeric',
//                 month: 'short',
//                 day: 'numeric'
//             });
//     }
//     return '';
// },
// label: (context: any) => {
//     const label = context.dataset.label || '';
//     const value = context.parsed.y;
//     return `${label}: ${value.toLocaleString(this.locale)}`;
// }

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
        bounds: 'data'
    };
}

export function getBtcYAxisConfig(): any {
    return {
        position: 'left',
        title: {
            display: true,
            text: 'SATS'
        },
        beginAtZero: false,
        grid: {
            display: true, // Enable gridlines for ybtc axis
            color: 'rgba(255, 255, 255, 0.1)'
        },
    };
}

export function getFiatYAxisConfig(units: (string | undefined)[]): any {
    return {
        position: 'right',
        title: {
            display: true,
            text: getFiatAxisLabel(units)
        },
        beginAtZero: false
    }
}