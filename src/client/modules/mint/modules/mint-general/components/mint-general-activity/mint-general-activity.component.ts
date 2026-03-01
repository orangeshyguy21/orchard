/* Core Dependencies */
import {ChangeDetectionStrategy, Component, computed, inject, input, output, signal, OnChanges, SimpleChanges} from '@angular/core';
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
	// ── Injected dependencies ──
	private readonly chartService = inject(ChartService);
	private readonly themeService = inject(ThemeService);
	private readonly settingDeviceService = inject(SettingDeviceService);

	// ── Inputs / Outputs ──
	public summary = input.required<MintActivitySummary | null>();
	public loading = input<boolean>(false);
	public error = input<boolean>(false);

	public period_change = output<MintActivityPeriod>();

	// ── Public signals ──
	public selected_period = signal<MintActivityPeriod>(MintActivityPeriod.Day);

	// ── Public properties ──
	public period_options: PeriodOption[] = [
		{value: MintActivityPeriod.Day, label: '24 hours'},
		{value: MintActivityPeriod.ThreeDay, label: '3 days'},
		{value: MintActivityPeriod.Week, label: '7 days'},
	];

	// ── Public computed signals ──
	public period_label = computed(() => {
		const option = this.period_options.find((o) => o.value === this.selected_period());
		return option?.label ?? '7 days';
	});

	public mint_chart_data: ChartConfiguration<'line'>['data'] | null = null;
	public melt_chart_data: ChartConfiguration<'line'>['data'] | null = null;
	public swap_chart_data: ChartConfiguration<'line'>['data'] | null = null;
	public sparkline_options: ChartConfiguration<'line'>['options'] = this.buildSparklineOptions();

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['loading'] && !changes['loading'].firstChange) {
			if (this.loading() === false) this.initCharts();
		}
	}

	/** Handles period selection from the mat-menu */
	public onPeriodChange(period: MintActivityPeriod): void {
		this.selected_period.set(period);
		this.period_change.emit(period);
	}

	/** Formats seconds into a human-readable duration */
	public formatDuration(seconds: number): string {
		if (seconds === 0) return '0s';
		if (seconds < 5) return `${Math.round(seconds * 1000)}ms`;
		if (seconds < 60) return `${Math.round(seconds)}s`;
		if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
		return `${(seconds / 3600).toFixed(1)}h`;
	}

	/** Builds chart data for the three sparklines */
	private initCharts(): void {
		const data = this.summary();
		if (!data) return;
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
					backgroundColor: (ctx: any) => this.chartService.createAreaGradient(ctx, color, 0.5, 0),
					borderWidth: 0,
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
