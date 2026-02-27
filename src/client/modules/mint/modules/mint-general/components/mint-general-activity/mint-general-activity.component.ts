/* Core Dependencies */
import {ChangeDetectionStrategy, Component, computed, input, output, signal, OnChanges} from '@angular/core';
/* Vendor Dependencies */
import {ChartConfiguration} from 'chart.js';
/* Application Dependencies */
import {ChartService} from '@client/modules/chart/services/chart/chart.service';
import {ThemeService} from '@client/modules/settings/services/theme/theme.service';
import {SettingDeviceService} from '@client/modules/settings/services/setting-device/setting-device.service';
/* Native Dependencies */
import {MintActivitySummary, MintActivityBucket} from '@client/modules/mint/classes/mint-activity-summary.class';
/* Shared Dependencies */
import {MintActivityPeriod} from '@shared/generated.types';

type PeriodOption = {
	value: MintActivityPeriod;
	label: string;
};

@Component({
	selector: 'orc-mint-general-activity',
	standalone: false,
	templateUrl: './mint-general-activity.component.html',
	styleUrl: './mint-general-activity.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintGeneralActivityComponent implements OnChanges {
	public summary = input.required<MintActivitySummary | null>();
	public loading = input<boolean>(false);
	public error = input<boolean>(false);

	public period_change = output<MintActivityPeriod>();

	public selected_period = signal<MintActivityPeriod>(MintActivityPeriod.Week);

	public period_options: PeriodOption[] = [
		{value: MintActivityPeriod.Day, label: '24 hours'},
		{value: MintActivityPeriod.ThreeDay, label: '3 days'},
		{value: MintActivityPeriod.Week, label: '7 days'},
	];

	public period_label = computed(() => {
		const option = this.period_options.find((o) => o.value === this.selected_period());
		return option?.label ?? '7 days';
	});

	// public mint_progress_color = computed(() => {
	// 	const summary = this.summary();
	// 	if (!summary) return '';
	// 	return summary.mint_completed_pct_delta >= 0 ? 'orc-status-active-progress-spinner' : 'orc-status-inactive-progress-spinner';
	// });

	// public melt_progress_color = computed(() => {
	// 	const summary = this.summary();
	// 	if (!summary) return '';
	// 	return summary.melt_completed_pct_delta >= 0 ? 'orc-status-active-progress-spinner' : 'orc-status-inactive-progress-spinner';
	// });

	public mint_chart_data: ChartConfiguration<'line'>['data'] | null = null;
	public melt_chart_data: ChartConfiguration<'line'>['data'] | null = null;
	public swap_chart_data: ChartConfiguration<'line'>['data'] | null = null;
	public sparkline_options: ChartConfiguration<'line'>['options'];

	constructor(
		private chartService: ChartService,
		private themeService: ThemeService,
		private settingDeviceService: SettingDeviceService,
	) {
		this.sparkline_options = this.buildSparklineOptions();
	}

	ngOnChanges(): void {
		if (this.summary()) this.initCharts();
	}

	/** Handles period selection from the mat-menu */
	public onPeriodChange(period: MintActivityPeriod): void {
		this.selected_period.set(period);
		this.period_change.emit(period);
	}

	// /** Formats a delta value for display */
	// public formatDelta(delta: number): string {
	// 	if (delta === 0) return '0%';
	// 	const sign = delta > 0 ? '+' : '';
	// 	return `${sign}${delta.toFixed(1)}%`;
	// }

	/** Formats seconds into a human-readable duration */
	public formatDuration(seconds: number): string {
		if (seconds === 0) return '0s';
		if (seconds < 60) return `${Math.round(seconds)}s`;
		if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
		return `${(seconds / 3600).toFixed(1)}h`;
	}

	/** Builds chart data for the three sparklines */
	private initCharts(): void {
		const data = this.summary()!;
		this.mint_chart_data = this.buildSparklineData(data.mint_sparkline, data.mint_count_delta);
		this.melt_chart_data = this.buildSparklineData(data.melt_sparkline, data.melt_count_delta);
		this.swap_chart_data = this.buildSparklineData(data.swap_sparkline, data.swap_count_delta);
	}

	/** Creates chart.js dataset from sparkline buckets with delta-driven color */
	private buildSparklineData(buckets: MintActivityBucket[], delta: number): ChartConfiguration<'line'>['data'] {
		const color = this.getDeltaColor(delta);
		return {
			labels: buckets.map((b) => b.created_time),
			datasets: [
				{
					data: buckets.map((b) => b.amount),
					tension: 0.4,
					fill: true,
					backgroundColor: (ctx: any) => this.chartService.createAreaGradient(ctx, color, 0.3, 0),
					borderColor: color,
					borderWidth: 1.5,
					pointRadius: 0,
				},
			],
		};
	}

	/** Returns green for growth, red for decline */
	private getDeltaColor(delta: number): string {
		const theme = this.settingDeviceService.getTheme();
		const token = delta >= 0 ? '--orc-status-active' : '--orc-status-inactive';
		return this.themeService.getThemeColor(token, theme);
	}

	/** Shared sparkline chart options — no axes, no legend, no tooltips */
	private buildSparklineOptions(): ChartConfiguration<'line'>['options'] {
		return {
			responsive: true,
			maintainAspectRatio: false,
			scales: {
				x: {display: false},
				y: {display: false},
			},
			plugins: {
				legend: {display: false},
				tooltip: {enabled: false},
			},
			elements: {
				line: {tension: 0.4},
			},
			animation: {
				duration: 600,
			},
		};
	}
}
