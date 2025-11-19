import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BitcoinSubsectionOracleRunProgressDateComponent} from './bitcoin-subsection-oracle-run-progress-date.component';

describe('BitcoinSubsectionOracleRunProgressDateComponent', () => {
	let component: BitcoinSubsectionOracleRunProgressDateComponent;
	let fixture: ComponentFixture<BitcoinSubsectionOracleRunProgressDateComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [BitcoinSubsectionOracleRunProgressDateComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(BitcoinSubsectionOracleRunProgressDateComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
