/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, output, signal, computed, viewChild, viewChildren, AfterViewInit} from '@angular/core';
/* Vendor Dependencies */
import {DateRange, DefaultMatCalendarRangeStrategy, MAT_DATE_RANGE_SELECTION_STRATEGY, MatCalendarCellClassFunction, MatMonthView} from '@angular/material/datepicker';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {DateTime, Info} from 'luxon';

@Component({
    selector: 'orc-form-scroll-calendar',
    standalone: false,
    templateUrl: './form-scroll-calendar.component.html',
    styleUrl: './form-scroll-calendar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{provide: MAT_DATE_RANGE_SELECTION_STRATEGY, useClass: DefaultMatCalendarRangeStrategy}],
})
export class FormScrollCalendarComponent implements AfterViewInit {
    public selected = input<DateRange<DateTime> | null>(null);
    public min = input<DateTime | null>(null);
    public max = input<DateTime | null>(null);
    public date_class = input<MatCalendarCellClassFunction<DateTime>>(() => '');

    public selectedChange = output<DateRange<DateTime>>();

    public viewport = viewChild<CdkVirtualScrollViewport>('viewport');
    public month_views = viewChildren(MatMonthView);

    public readonly month_height = 256;
    public readonly weekday_labels: string[] = Info.weekdays('short');
    public months: DateTime[] = [];

    public range_start = signal<DateTime | null>(null);
    public range_end = signal<DateTime | null>(null);
    public selection_state = signal<'start' | 'end'>('start');

    public current_range = computed(() => {
        return new DateRange<DateTime>(this.range_start(), this.range_end());
    });

    private initial_index = 0;

    constructor() {
        this.months = this.generateMonths();
        this.initial_index = this.getInitialIndex();
    }

    ngAfterViewInit(): void {
        const vp = this.viewport();
        if (vp) {
            vp.scrollToIndex(this.initial_index, 'instant');
        }
    }

    /**
     * Handles date selection from any MatMonthView.
     * Two-click model: first click sets start, second click sets end.
     * Clicking the same date twice selects a single day (start === end).
     */
    public onDateSelected(date: DateTime): void {
        if (this.selection_state() === 'start') {
            this.range_start.set(date);
            this.range_end.set(null);
            this.selection_state.set('end');
        } else {
            const start = this.range_start();
            if (start && date < start) {
                this.range_end.set(start);
                this.range_start.set(date);
            } else {
                this.range_end.set(date);
            }
            this.selection_state.set('start');
            this.selectedChange.emit(new DateRange<DateTime>(this.range_start(), this.range_end()));
        }
    }

    /** Scrolls the viewport to the month containing today */
    public scrollToToday(): void {
        const today = DateTime.now();
        const index = this.months.findIndex((m) => m.hasSame(today, 'month') && m.hasSame(today, 'year'));
        if (index >= 0) {
            this.viewport()?.scrollToIndex(index, 'smooth');
        }
    }

    /** Scrolls the viewport to a specific date */
    public scrollToDate(date: DateTime): void {
        const target_month = date.startOf('month');
        const index = this.months.findIndex((m) => m.hasSame(target_month, 'month') && m.hasSame(target_month, 'year'));
        if (index >= 0) {
            this.viewport()?.scrollToIndex(Math.max(0, index), 'smooth');
        }
    }

    /** Sets the range externally (e.g. from presets) and updates internal state */
    public setRange(start: DateTime, end: DateTime): void {
        this.range_start.set(start);
        this.range_end.set(end);
        this.selection_state.set('start');
    }

    /** Initializes range from selected input when the panel opens */
    public initFromSelection(): void {
        const sel = this.selected();
        if (sel) {
            this.range_start.set(sel.start);
            this.range_end.set(sel.end);
            this.selection_state.set('start');
        }
        const target = sel?.end ?? sel?.start ?? DateTime.now();
        const target_month = target.startOf('month');
        const index = this.months.findIndex((m) => m.hasSame(target_month, 'month') && m.hasSame(target_month, 'year'));
        if (index >= 0) {
            this.viewport()?.scrollToIndex(Math.max(0, index), 'instant');
        }
    }

    /** Amplifies discrete mouse wheel scroll for comfortable navigation */
    public onWheel(event: WheelEvent): void {
        const vp = this.viewport();
        if (!vp) return;
        if (Math.abs(event.deltaY) <= 50) return;
        event.preventDefault();
        vp.elementRef.nativeElement.scrollTop += event.deltaY * 1.1;
    }

    /** Handles hover over calendar cells to propagate preview across all visible months */
    public onCellHover(event: MouseEvent, month: DateTime): void {
        if (this.selection_state() !== 'end') return;
        const cell = (event.target as HTMLElement).closest('button.mat-calendar-body-cell');
        if (!cell) return;
        const content = cell.querySelector('.mat-calendar-body-cell-content');
        if (!content) return;
        const day = parseInt(content.textContent?.trim() || '', 10);
        if (isNaN(day) || day < 1 || day > 31) return;
        const hovered_date = month.set({day});
        this.updatePreview(hovered_date);
    }

    /** Clears preview on all visible month views when mouse leaves the calendar */
    public onViewportLeave(): void {
        if (this.selection_state() !== 'end') return;
        for (const mv of this.month_views()) {
            (mv as any)._previewStart.set(null);
            (mv as any)._previewEnd.set(null);
        }
    }

    /** TrackBy function for virtual scroll months */
    public trackByMonth(_index: number, month: DateTime): number {
        return month.toMillis();
    }

    /** Sets preview start/end on all visible MatMonthView instances */
    private updatePreview(hovered_date: DateTime): void {
        const start = this.range_start();
        if (!start) return;
        const preview_start = this.dateToCompareValue(start);
        const preview_end = this.dateToCompareValue(hovered_date);
        for (const mv of this.month_views()) {
            (mv as any)._previewStart.set(preview_start);
            (mv as any)._previewEnd.set(preview_end);
        }
    }

    /** Converts a Luxon DateTime to Material's internal compare value (JS Date timestamp) */
    private dateToCompareValue(date: DateTime): number {
        return new Date(date.year, date.month - 1, date.day).getTime();
    }

    /** Generates array of 1st-of-month DateTime objects spanning 10 years */
    private generateMonths(): DateTime[] {
        const today = DateTime.now();
        const start = today.minus({years: 5}).startOf('month');
        const end = today.plus({years: 5}).startOf('month');
        const months: DateTime[] = [];
        let current = start;
        while (current <= end) {
            months.push(current);
            current = current.plus({months: 1});
        }
        return months;
    }

    /** Gets the initial scroll index based on selected start date or today */
    private getInitialIndex(): number {
        const sel = this.selected();
        const target = sel?.end ?? sel?.start ?? DateTime.now();
        const target_month = target.startOf('month');
        const index = this.months.findIndex((m) => m.hasSame(target_month, 'month') && m.hasSame(target_month, 'year'));
        return Math.max(0, index);
    }
}
