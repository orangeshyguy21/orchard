/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Vendor Dependencies */
import {DateRange} from '@angular/material/datepicker';
import {DateTime} from 'luxon';
/* Native Dependencies */
import {OrcFormModule} from '@client/modules/form/form.module';
/* Local Dependencies */
import {FormScrollCalendarComponent} from './form-scroll-calendar.component';

describe('FormScrollCalendarComponent', () => {
	let component: FormScrollCalendarComponent;
	let fixture: ComponentFixture<FormScrollCalendarComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcFormModule],
		}).compileComponents();

		fixture = TestBed.createComponent(FormScrollCalendarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should generate months spanning 10 years', () => {
		expect(component.months.length).toBeGreaterThan(100);
		const first = component.months[0];
		const last = component.months[component.months.length - 1];
		const diff = last.diff(first, 'years').years;
		expect(diff).toBeCloseTo(10, 0);
	});

	it('should initialize with start selection state', () => {
		expect(component.selection_state()).toBe('start');
	});

	it('should initialize range signals as null', () => {
		expect(component.range_start()).toBeNull();
		expect(component.range_end()).toBeNull();
	});

	it('should compute current_range from range signals', () => {
		const range = component.current_range();
		expect(range).toBeInstanceOf(DateRange);
		expect(range.start).toBeNull();
		expect(range.end).toBeNull();
	});

	it('should compute month_height as 256 for desktop', () => {
		expect(component.month_height()).toBe(256);
	});

	it('should compute weekday_labels with 7 entries', () => {
		const labels = component.weekday_labels();
		expect(labels.length).toBe(7);
	});

	describe('onDateSelected', () => {
		it('should set range_start on first click', () => {
			const date = DateTime.now().startOf('day');
			component.onDateSelected(date);
			expect(component.range_start()).toEqual(date);
			expect(component.range_end()).toBeNull();
			expect(component.selection_state()).toBe('end');
		});

		it('should set range_end on second click and emit selectedChange', () => {
			const spy = jasmine.createSpy('selectedChange');
			component.selectedChange.subscribe(spy);

			const start = DateTime.now().startOf('day').minus({days: 5});
			const end = DateTime.now().startOf('day');

			component.onDateSelected(start);
			component.onDateSelected(end);

			expect(component.range_start()).toEqual(start);
			expect(component.range_end()).toEqual(end);
			expect(component.selection_state()).toBe('start');
			expect(spy).toHaveBeenCalledTimes(1);

			const emitted_range: DateRange<DateTime> = spy.calls.first().args[0];
			expect(emitted_range.start).toEqual(start);
			expect(emitted_range.end).toEqual(end);
		});

		it('should swap start and end when second click is before start', () => {
			const later = DateTime.now().startOf('day');
			const earlier = later.minus({days: 10});

			component.onDateSelected(later);
			component.onDateSelected(earlier);

			expect(component.range_start()).toEqual(earlier);
			expect(component.range_end()).toEqual(later);
		});

		it('should handle same date clicked twice as single day selection', () => {
			const spy = jasmine.createSpy('selectedChange');
			component.selectedChange.subscribe(spy);

			const date = DateTime.now().startOf('day');
			component.onDateSelected(date);
			component.onDateSelected(date);

			expect(component.range_start()).toEqual(date);
			expect(component.range_end()).toEqual(date);
			expect(spy).toHaveBeenCalledTimes(1);
		});
	});

	describe('setRange', () => {
		it('should set range_start and range_end', () => {
			const start = DateTime.now().minus({days: 7});
			const end = DateTime.now();

			component.setRange(start, end);

			expect(component.range_start()).toEqual(start);
			expect(component.range_end()).toEqual(end);
			expect(component.selection_state()).toBe('start');
		});
	});

	describe('initFromSelection', () => {
		it('should initialize range from selected input', () => {
			const start = DateTime.now().minus({days: 30});
			const end = DateTime.now();

			fixture.componentRef.setInput('selected', new DateRange<DateTime>(start, end));
			fixture.detectChanges();

			component.initFromSelection();

			expect(component.range_start()).toEqual(start);
			expect(component.range_end()).toEqual(end);
			expect(component.selection_state()).toBe('start');
		});

		it('should handle null selection gracefully', () => {
			component.initFromSelection();
			expect(component.range_start()).toBeNull();
			expect(component.range_end()).toBeNull();
		});
	});

	describe('scrollToToday', () => {
		it('should not throw when called', () => {
			expect(() => component.scrollToToday()).not.toThrow();
		});
	});

	describe('scrollToDate', () => {
		it('should not throw for a valid date', () => {
			const date = DateTime.now().minus({months: 3});
			expect(() => component.scrollToDate(date)).not.toThrow();
		});
	});

	describe('onWheel', () => {
		it('should ignore small delta values', () => {
			const event = new WheelEvent('wheel', {deltaY: 10});
			expect(() => component.onWheel(event)).not.toThrow();
		});
	});

	describe('onViewportLeave', () => {
		it('should not throw when selection_state is start', () => {
			expect(() => component.onViewportLeave()).not.toThrow();
		});
	});

	describe('trackByMonth', () => {
		it('should return millis for a DateTime', () => {
			const month = DateTime.fromISO('2025-06-01');
			expect(component.trackByMonth(0, month)).toBe(month.toMillis());
		});
	});
});
