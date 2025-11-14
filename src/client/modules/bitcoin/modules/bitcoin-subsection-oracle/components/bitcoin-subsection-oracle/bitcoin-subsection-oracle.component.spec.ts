import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BitcoinSubsectionOracleComponent} from './bitcoin-subsection-oracle.component';

describe('BitcoinSubsectionOracleComponent', () => {
	let component: BitcoinSubsectionOracleComponent;
	let fixture: ComponentFixture<BitcoinSubsectionOracleComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [BitcoinSubsectionOracleComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(BitcoinSubsectionOracleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
