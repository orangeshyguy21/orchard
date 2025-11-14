import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BitcoinSubsectionOracleControlComponent} from './bitcoin-subsection-oracle-control.component';

describe('BitcoinSubsectionOracleControlComponent', () => {
	let component: BitcoinSubsectionOracleControlComponent;
	let fixture: ComponentFixture<BitcoinSubsectionOracleControlComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [BitcoinSubsectionOracleControlComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(BitcoinSubsectionOracleControlComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
