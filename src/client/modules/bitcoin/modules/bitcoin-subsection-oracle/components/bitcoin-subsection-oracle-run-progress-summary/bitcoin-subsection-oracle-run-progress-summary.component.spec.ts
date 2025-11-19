import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BitcoinSubsectionOracleRunProgressSummaryComponent} from './bitcoin-subsection-oracle-run-progress-summary.component';

describe('BitcoinSubsectionOracleRunProgressSummaryComponent', () => {
	let component: BitcoinSubsectionOracleRunProgressSummaryComponent;
	let fixture: ComponentFixture<BitcoinSubsectionOracleRunProgressSummaryComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [BitcoinSubsectionOracleRunProgressSummaryComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(BitcoinSubsectionOracleRunProgressSummaryComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
