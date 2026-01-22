import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MintSubsectionDashboardBalancesheetChartComponent} from './mint-subsection-dashboard-balancesheet-chart.component';

describe('MintSubsectionDashboardBalancesheetChartComponent', () => {
	let component: MintSubsectionDashboardBalancesheetChartComponent;
	let fixture: ComponentFixture<MintSubsectionDashboardBalancesheetChartComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionDashboardBalancesheetChartComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionDashboardBalancesheetChartComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
