/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcMintGeneralModule} from '@client/modules/mint/modules/mint-general/mint-general.module';
import {MintActivitySummary, MintActivityBucket} from '@client/modules/mint/classes/mint-activity-summary.class';
/* Shared Dependencies */
import {MintActivityPeriod} from '@shared/generated.types';
/* Local Dependencies */
import {MintGeneralActivityComponent} from './mint-general-activity.component';

/** Builds a mock MintActivitySummary with sensible defaults */
function buildMockSummary(overrides: Partial<MintActivitySummary> = {}): MintActivitySummary {
	const buckets: MintActivityBucket[] = [
		{created_time: 1, amount: 10},
		{created_time: 2, amount: 20},
		{created_time: 3, amount: 15},
	];
	return new MintActivitySummary({
		total_operations: 100,
		total_operations_delta: 5,
		total_volume: 5000,
		total_volume_delta: -2,
		mint_count: 40,
		mint_count_delta: 10,
		mint_sparkline: buckets,
		melt_count: 35,
		melt_count_delta: -5,
		melt_sparkline: buckets,
		swap_count: 25,
		swap_count_delta: 0,
		swap_sparkline: buckets,
		mint_completed_pct: 95,
		mint_completed_pct_delta: 2,
		mint_avg_time: 30,
		mint_avg_time_delta: -1,
		melt_completed_pct: 88,
		melt_completed_pct_delta: -3,
		melt_avg_time: 45,
		melt_avg_time_delta: 5,
		...overrides,
	});
}

describe('MintGeneralActivityComponent', () => {
	let component: MintGeneralActivityComponent;
	let fixture: ComponentFixture<MintGeneralActivityComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintGeneralModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintGeneralActivityComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('summary', null);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should default to Week period', () => {
		expect(component.selected_period()).toBe(MintActivityPeriod.Week);
	});

	it('should compute period_label from selected_period', () => {
		expect(component.period_label()).toBe('7 days');

		component.selected_period.set(MintActivityPeriod.Day);
		expect(component.period_label()).toBe('24 hours');

		component.selected_period.set(MintActivityPeriod.ThreeDay);
		expect(component.period_label()).toBe('3 days');
	});

	it('should emit period_change and update signal on onPeriodChange', () => {
		spyOn(component.period_change, 'emit');

		component.onPeriodChange(MintActivityPeriod.Day);

		expect(component.selected_period()).toBe(MintActivityPeriod.Day);
		expect(component.period_change.emit).toHaveBeenCalledWith(MintActivityPeriod.Day);
	});

	describe('formatDuration', () => {
		it('should return 0s for zero', () => {
			expect(component.formatDuration(0)).toBe('0s');
		});

		it('should return milliseconds for values under 5s', () => {
			expect(component.formatDuration(0.5)).toBe('500ms');
			expect(component.formatDuration(2)).toBe('2000ms');
		});

		it('should return seconds for values under 60s', () => {
			expect(component.formatDuration(30)).toBe('30s');
		});

		it('should return minutes for values under 3600s', () => {
			expect(component.formatDuration(120)).toBe('2m');
			expect(component.formatDuration(3599)).toBe('60m');
		});

		it('should return hours for values >= 3600s', () => {
			expect(component.formatDuration(3600)).toBe('1.0h');
			expect(component.formatDuration(7200)).toBe('2.0h');
		});
	});

	describe('chart initialization', () => {
		it('should build chart data when loading transitions to false', () => {
			fixture.componentRef.setInput('summary', buildMockSummary());
			fixture.componentRef.setInput('loading', true);
			fixture.detectChanges();

			expect(component.mint_chart_data).toBeNull();

			fixture.componentRef.setInput('loading', false);
			fixture.detectChanges();

			expect(component.mint_chart_data).not.toBeNull();
			expect(component.melt_chart_data).not.toBeNull();
			expect(component.swap_chart_data).not.toBeNull();
		});

		it('should have correct number of data points in sparkline datasets', () => {
			fixture.componentRef.setInput('summary', buildMockSummary());
			fixture.componentRef.setInput('loading', true);
			fixture.detectChanges();
			fixture.componentRef.setInput('loading', false);
			fixture.detectChanges();

			expect(component.mint_chart_data!.datasets[0].data.length).toBe(3);
			expect(component.mint_chart_data!.labels!.length).toBe(3);
		});
	});

	describe('sparkline options', () => {
		it('should have axes hidden', () => {
			const options = component.sparkline_options!;
			expect((options.scales as any).x.display).toBe(false);
			expect((options.scales as any).y.display).toBe(false);
		});

		it('should have legend and tooltip disabled', () => {
			const options = component.sparkline_options!;
			expect(options.plugins!.legend!.display).toBe(false);
			expect((options.plugins!.tooltip as any).enabled).toBe(false);
		});
	});
});
