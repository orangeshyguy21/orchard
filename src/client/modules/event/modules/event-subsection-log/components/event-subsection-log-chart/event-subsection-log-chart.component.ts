/* Core Dependencies */
import {
	ChangeDetectionStrategy,
	Component,
	OnChanges,
	OnDestroy,
	SimpleChanges,
	ViewChild,
	input,
	output,
	signal,
	computed,
	inject,
} from '@angular/core';
/* Vendor Dependencies */
import {BaseChartDirective} from 'ng2-charts';
import {ChartConfiguration, BubbleDataPoint} from 'chart.js';
import {DateTime} from 'luxon';
import {Subscription} from 'rxjs';
/* Application Dependencies */
import {ChartService} from '@client/modules/chart/services/chart/chart.service';
/* Native Dependencies */
import {EventLog} from '@client/modules/event/classes/event-log.class';
/* Shared Dependencies */
import {EventLogStatus} from '@shared/generated.types';

type BucketInterval = 'hour' | 'day' | 'week' | 'month';

interface EventTimelineBucket {
	timestamp: number;
	total: number;
	success: number;
	error: number;
	partial: number;
}

interface BubblePointMeta extends BubbleDataPoint {
	bucket: EventTimelineBucket;
}

@Component({
	selector: 'orc-event-subsection-log-chart',
	standalone: false,
	templateUrl: './event-subsection-log-chart.component.html',
	styleUrl: './event-subsection-log-chart.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventSubsectionLogChartComponent implements OnChanges, OnDestroy {
	private readonly chartService = inject(ChartService);

	@ViewChild(BaseChartDirective) chart?: BaseChartDirective;

	public readonly events = input.required<EventLog[]>();
	public readonly date_start = input.required<number>();
	public readonly date_end = input.required<number>();
	public readonly locale = input.required<string>();
	public readonly loading = input.required<boolean>();
	public readonly page_index = input.required<number>();
	public readonly page_size = input.required<number>();
	public readonly count = input.required<number>();

	public readonly page_count = computed(() => Math.ceil(this.count() / (this.page_size() || 100)));

	public readonly pageChange = output<number>();

	public chart_type: 'bubble' = 'bubble';
	public chart_data!: ChartConfiguration<'bubble'>['data'];
	public chart_options!: ChartConfiguration<'bubble'>['options'];
	public displayed = signal<boolean>(true);
	private current_interval: BucketInterval = 'day';

	public readonly has_data = computed(() => {
		return this.events().length > 0;
	});

	private subscriptions = new Subscription();

	constructor() {
		this.subscriptions.add(this.getRemoveSubscription());
		this.subscriptions.add(this.getAddSubscription());
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['loading'] && !changes['loading'].firstChange && this.loading() === false) {
			this.init();
		}
		if (changes['events'] && !changes['events'].firstChange) {
			this.init();
		}
	}

	private getRemoveSubscription(): Subscription {
		return this.chartService.onResizeStart().subscribe(() => {
			this.displayed.set(false);
		});
	}
	private getAddSubscription(): Subscription {
		return this.chartService.onResizeEnd().subscribe(() => {
			this.displayed.set(true);
		});
	}

	/* *******************************************************
        Pagination
    ******************************************************** */

	/** Navigates to first page */
	public onFirst(): void {
		this.pageChange.emit(0);
	}

	/** Navigates to previous page */
	public onPrev(): void {
		this.pageChange.emit(this.page_index() - 1);
	}

	/** Navigates to next page */
	public onNext(): void {
		this.pageChange.emit(this.page_index() + 1);
	}

	/** Navigates to last page */
	public onLast(): void {
		this.pageChange.emit(this.page_count() - 1);
	}

	/* *******************************************************
        Chart Init
    ******************************************************** */

	/** Orchestrates chart data and options building */
	private init(): void {
		const events = this.events();
		if (events.length === 0) return;
		this.current_interval = this.getBucketInterval(this.date_start(), this.date_end());
		const buckets = this.bucketEvents(events, this.current_interval);
		const max_count = Math.max(...buckets.map((b) => b.total));
		this.chart_data = this.buildChartData(buckets, max_count);
		this.chart_options = this.buildChartOptions(this.current_interval);
		setTimeout(() => this.chart?.chart?.resize());
	}

	/* *******************************************************
        Bucketing
    ******************************************************** */

	/** Determines bucket interval based on date range span */
	private getBucketInterval(date_start: number, date_end: number): BucketInterval {
		const diff_days = DateTime.fromSeconds(date_end).diff(DateTime.fromSeconds(date_start), 'days').days;
		if (diff_days <= 2) return 'hour';
		if (diff_days <= 60) return 'day';
		if (diff_days <= 180) return 'week';
		return 'month';
	}

	/** Groups events into time buckets and calculates status counts */
	private bucketEvents(events: EventLog[], interval: BucketInterval): EventTimelineBucket[] {
		const bucket_map = new Map<number, EventTimelineBucket>();
		for (const event of events) {
			const key = Math.floor(DateTime.fromSeconds(event.timestamp).startOf(interval).toSeconds());
			let bucket = bucket_map.get(key);
			if (!bucket) {
				bucket = {timestamp: key, total: 0, success: 0, error: 0, partial: 0};
				bucket_map.set(key, bucket);
			}
			bucket.total++;
			if (event.status === EventLogStatus.Success) bucket.success++;
			else if (event.status === EventLogStatus.Error) bucket.error++;
			else if (event.status === EventLogStatus.Partial) bucket.partial++;
		}
		return Array.from(bucket_map.values()).sort((a, b) => a.timestamp - b.timestamp);
	}

	/* *******************************************************
        Dot Styling
    ******************************************************** */

	/** Maps bucket count to 3-tier dot radius relative to max */
	private getDotRadius(count: number, max_count: number): number {
		if (max_count === 0) return 5;
		const ratio = count / max_count;
		if (ratio <= 0.33) return 5;
		if (ratio <= 0.66) return 10;
		return 16;
	}

	/** Returns dot color based on success/error ratio, matching event icon status colors */
	private getDotColor(bucket: EventTimelineBucket): string {
		let token = '--orc-status-active';
		if (bucket.success === 0 && bucket.partial === 0) token = '--orc-status-inactive';
		else if (bucket.error > 0 || bucket.partial > 0) token = '--orc-status-warning';
		const hex = this.chartService.getGridColor(token);
		return this.chartService.hexToRgba(hex, 0.6);
	}

	/* *******************************************************
        Tooltip
    ******************************************************** */

	/** Returns the hex color for a given status token */
	private getStatusColor(token: string): string {
		return this.chartService.getGridColor(token);
	}

	/** Formats bucket timestamp using Luxon with the global locale */
	private formatBucketTimestamp(timestamp: number): string {
		const dt = DateTime.fromSeconds(timestamp);
		if (this.current_interval === 'hour') return dt.toLocaleString(DateTime.DATETIME_MED);
		return dt.toLocaleString(DateTime.DATE_MED);
	}

	/** Renders a custom HTML tooltip with colored status dots */
	private renderTooltip(context: any): void {
		const {chart, tooltip} = context;
		let el = chart.canvas.parentNode.querySelector('[data-chart-tooltip]') as HTMLDivElement | null;

		if (!el) {
			el = document.createElement('div');
			el.setAttribute('data-chart-tooltip', '');
			Object.assign(el.style, {
				position: 'absolute',
				pointerEvents: 'none',
				transform: 'translate(-50%, -100%)',
				marginTop: '-0.5rem',
				padding: '0.375rem 0.625rem',
				background: 'var(--mat-sys-surface-container-highest)',
				color: 'var(--mat-sys-on-surface)',
				fontSize: '0.75rem',
				lineHeight: '1.4',
				whiteSpace: 'nowrap',
				borderRadius: 'var(--mat-sys-corner-extra-small)',
				transition: 'opacity 0.15s ease',
				zIndex: '10',
			});
			chart.canvas.parentNode.appendChild(el);
		}

		if (tooltip.opacity === 0) {
			el.style.opacity = '0';
			return;
		}

		const point = tooltip.dataPoints?.[0]?.raw as BubblePointMeta | undefined;
		if (!point) return;

		const b = point.bucket;
		const active_color = this.getStatusColor('--orc-status-active');
		const inactive_color = this.getStatusColor('--orc-status-inactive');
		const warning_color = this.getStatusColor('--orc-status-warning');
		const outline_color = this.getStatusColor('--mat-sys-outline');

		const dot = (color: string) =>
			`<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${color};margin-right:6px;"></span>`;

		const lines: string[] = [
			`<div style="color:${outline_color};margin-bottom:2px;">${this.formatBucketTimestamp(b.timestamp)}</div>`,
			`<div style="margin-bottom:4px;">${b.total} event${b.total !== 1 ? 's' : ''}</div>`,
		];
		if (b.success > 0) lines.push(`<div>${dot(active_color)}${b.success} success</div>`);
		if (b.error > 0) lines.push(`<div>${dot(inactive_color)}${b.error} failed</div>`);
		if (b.partial > 0) lines.push(`<div>${dot(warning_color)}${b.partial} partial</div>`);

		el.innerHTML = lines.join('');
		el.style.opacity = '1';
		el.style.left = tooltip.caretX + 'px';
		el.style.top = tooltip.caretY + 'px';
	}

	/* *******************************************************
        Chart Data & Options
    ******************************************************** */

	/** Builds Chart.js bubble dataset from bucketed events */
	private buildChartData(buckets: EventTimelineBucket[], max_count: number): ChartConfiguration<'bubble'>['data'] {
		const data: BubblePointMeta[] = buckets.map((bucket) => ({
			x: bucket.timestamp * 1000,
			y: 0,
			r: this.getDotRadius(bucket.total, max_count),
			bucket,
		}));
		return {
			datasets: [
				{
					data,
					backgroundColor: buckets.map((b) => this.getDotColor(b)),
					hoverBackgroundColor: buckets.map((b) => this.getDotColor(b)),
					borderColor: 'transparent',
					hoverBorderColor: this.chartService.getGridColor('--mat-sys-outline'),
					hoverBorderWidth: 2,
				},
			],
		};
	}

	/** Builds Chart.js options with time axis, hidden y-axis, and custom tooltip */
	private buildChartOptions(interval: BucketInterval): ChartConfiguration<'bubble'>['options'] {
		const time_unit = interval === 'hour' ? 'hour' : interval === 'day' ? 'day' : interval === 'week' ? 'week' : 'month';
		return {
			responsive: true,
			maintainAspectRatio: false,
			layout: {
				padding: {top: 4, bottom: 24, left: 0, right: 0},
			},
			scales: {
				x: {
					type: 'time',
					position: {y: -1},
					min: this.date_start() * 1000,
					max: this.date_end() * 1000,
					time: {
						unit: time_unit,
					},
					adapters: {
						date: {
							locale: this.locale(),
						},
					},
					ticks: {
						maxRotation: 0,
						autoSkip: true,
						color: this.chartService.getGridColor('--mat-sys-outline-variant'),
						font: {size: 10},
					},
					grid: {display: false},
					border: {display: true, color: this.chartService.getGridColor('--mat-sys-outline-variant')},
				},
				y: {
					display: false,
					min: -1,
					max: 1,
				},
			},
			plugins: {
				legend: {display: false},
				tooltip: {
					enabled: false,
					external: (context: any) => this.renderTooltip(context),
				},
			},
		};
	}

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}
}
