import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BitcoinSubsectionOracleChartComponent} from './bitcoin-subsection-oracle-chart.component';

describe('BitcoinSubsectionOracleChartComponent', () => {
	let component: BitcoinSubsectionOracleChartComponent;
	let fixture: ComponentFixture<BitcoinSubsectionOracleChartComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [BitcoinSubsectionOracleChartComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(BitcoinSubsectionOracleChartComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
