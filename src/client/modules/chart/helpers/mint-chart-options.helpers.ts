/* Vendor Dependencies */
import {TimeUnit} from 'chart.js';
import {DateTime} from 'luxon';
/* Shared Dependencies */
import {OrchardAnalyticsInterval} from '@shared/generated.types';

function getFiatAxisLabel(units: (string | undefined)[]): string {
	const has_usd = units.some((item) => item === 'USD');
	const has_eur = units.some((item) => item === 'EUR');
	if (has_usd && has_eur) return 'USD / EUR';
	if (has_usd) return 'USD';
	if (has_eur) return 'EUR';
	return 'FIAT';
}

function convertIntervalToTimeUnit(interval: OrchardAnalyticsInterval): TimeUnit {
	const interval_mapping: Record<OrchardAnalyticsInterval, TimeUnit> = {
		day: 'day',
		week: 'week',
		month: 'month',
		custom: 'day',
	};
	return interval_mapping[interval] || 'day';
}

function getTimeTicks(timestamp: number): string {
	return DateTime.fromMillis(timestamp).toLocaleString({
		month: 'short',
		day: 'numeric',
	});
}

export function getYAxis(units: (string | undefined)[]): string[] {
	const lower_units = units.map((unit) => unit?.toLowerCase());
	const y_axis: string[] = [];
	if (lower_units.includes('sat') || lower_units.includes('btc') || lower_units.includes('msat')) {
		y_axis.push('ybtc');
	}
	if (lower_units.includes('usd') || lower_units.includes('eur')) {
		y_axis.push('yfiat');
	}
	return y_axis;
}

export function getTooltipTitle(tooltipItems: any): string {
	if (tooltipItems.length > 0) {
		return DateTime.fromMillis(tooltipItems[0].parsed.x).toLocaleString({
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	}
	return '';
}

export function getTooltipTitleExact(tooltipItems: any): string {
	if (tooltipItems.length > 0) {
		return DateTime.fromMillis(tooltipItems[0].parsed.x).toLocaleString({
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric',
		});
	}
	return '';
}

export function getTooltipLabel(context: any, locale: string): string {
	const label = context.dataset.label || '';
	const value = context.parsed.y;
	return `${label}: ${value.toLocaleString(locale)}`;
}

export function getXAxisConfig(selected_interval: OrchardAnalyticsInterval, locale: string): any {
	const timeunit = convertIntervalToTimeUnit(selected_interval);
	return {
		type: 'time',
		time: {
			unit: timeunit,
			displayFormats: {
				day: 'short',
			},
			tooltipFormat: 'full',
		},
		adapters: {
			date: {
				locale: locale,
			},
		},
		ticks: {
			source: 'data',
			callback: getTimeTicks,
		},
		bounds: 'data',
		grid: {
			display: false,
		},
	};
}

export function getBtcYAxisConfig({grid_color, begin_at_zero}: {grid_color: string; begin_at_zero?: boolean}): any {
	return {
		position: 'left',
		title: {
			display: true,
			text: 'SAT',
		},
		beginAtZero: begin_at_zero ?? false,
		grid: {
			display: true, // Enable gridlines for ybtc axis
			color: grid_color,
		},
	};
}

export function getFiatYAxisConfig({
	units,
	show_grid,
	grid_color,
	begin_at_zero,
}: {
	units: (string | undefined)[];
	show_grid: boolean;
	grid_color: string;
	begin_at_zero?: boolean;
}): any {
	return {
		position: 'right',
		title: {
			display: true,
			text: getFiatAxisLabel(units),
		},
		beginAtZero: begin_at_zero ?? false,
		grid: {
			display: show_grid,
			color: grid_color,
		},
	};
}
