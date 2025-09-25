import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MintAnalyticChartComponent} from './mint-analytic-chart.component';

describe('MintBalanceChartComponent', () => {
	let component: MintAnalyticChartComponent;
	let fixture: ComponentFixture<MintAnalyticChartComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintAnalyticChartComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintAnalyticChartComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
