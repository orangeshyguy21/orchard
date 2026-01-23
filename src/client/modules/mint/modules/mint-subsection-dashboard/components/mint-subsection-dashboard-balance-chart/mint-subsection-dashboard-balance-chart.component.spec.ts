import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MintSubsectionDashboardBalanceChartComponent} from './mint-subsection-dashboard-balancesheet-chart.component';

describe('MintSubsectionDashboardBalanceChartComponent', () => {
	let component: MintSubsectionDashboardBalanceChartComponent;
	let fixture: ComponentFixture<MintSubsectionDashboardBalanceChartComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionDashboardBalanceChartComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionDashboardBalanceChartComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
