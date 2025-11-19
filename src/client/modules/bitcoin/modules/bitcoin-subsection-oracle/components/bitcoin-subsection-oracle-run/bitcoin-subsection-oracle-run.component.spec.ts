import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BitcoinSubsectionOracleRunComponent} from './bitcoin-subsection-oracle-run.component';

describe('BitcoinSubsectionOracleRunComponent', () => {
	let component: BitcoinSubsectionOracleRunComponent;
	let fixture: ComponentFixture<BitcoinSubsectionOracleRunComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [BitcoinSubsectionOracleRunComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(BitcoinSubsectionOracleRunComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
