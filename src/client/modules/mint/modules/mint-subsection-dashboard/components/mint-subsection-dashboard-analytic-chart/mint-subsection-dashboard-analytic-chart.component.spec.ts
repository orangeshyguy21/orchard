/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSubsectionDashboardAnalyticChartComponent} from './mint-subsection-dashboard-analytic-chart.component';

describe('MintSubsectionDashboardAnalyticChartComponent', () => {
	let component: MintSubsectionDashboardAnalyticChartComponent;
	let fixture: ComponentFixture<MintSubsectionDashboardAnalyticChartComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionDashboardAnalyticChartComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionDashboardAnalyticChartComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
