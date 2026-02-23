/* Core Dependencies */
import {ChangeDetectionStrategy, Component, OnChanges, OnDestroy, SimpleChanges, ViewChild, input, output, signal, computed, inject} from '@angular/core';
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
            console.log('onResizeStart');
			this.displayed.set(false);
		});
	}
	private getAddSubscription(): Subscription {
		return this.chartService.onResizeEnd().subscribe(() => {
            console.log('onResizeEnd');
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
        const interval = this.getBucketInterval(this.date_start(), this.date_end());
        const buckets = this.bucketEvents(events, interval);
        const max_count = Math.max(...buckets.map((b) => b.total));
        this.chart_data = this.buildChartData(buckets, max_count);
        this.chart_options = this.buildChartOptions(interval);
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
        let token = '--mat-sys-tertiary-container';
        if (bucket.success === 0 && bucket.partial === 0) token = '--mat-sys-error';
        else if (bucket.error > 0 || bucket.partial > 0) token = '--orc-on-warning-bg';
        return this.chartService.getGridColor(token);
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
                        tooltipFormat: interval === 'hour' ? 'MMM d, h:mm a' : 'MMM d, yyyy',
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
                    enabled: true,
                    callbacks: {
                        label: (context: any) => {
                            const point = context.raw as BubblePointMeta;
                            const b = point.bucket;
                            const parts = [`${b.total} event${b.total !== 1 ? 's' : ''}`];
                            if (b.success > 0) parts.push(`${b.success} success`);
                            if (b.error > 0) parts.push(`${b.error} failed`);
                            if (b.partial > 0) parts.push(`${b.partial} partial`);
                            return parts.join(', ');
                        },
                    },
                },
            },
        };
    }
    
    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
