/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSubsectionDashboardChartComponent} from './mint-subsection-dashboard-chart.component';

describe('MintSubsectionDashboardChartComponent', () => {
	let component: MintSubsectionDashboardChartComponent;
	let fixture: ComponentFixture<MintSubsectionDashboardChartComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionDashboardChartComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionDashboardChartComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
