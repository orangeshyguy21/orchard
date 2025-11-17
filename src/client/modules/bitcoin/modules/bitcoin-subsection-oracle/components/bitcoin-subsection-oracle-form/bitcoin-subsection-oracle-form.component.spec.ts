import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BitcoinSubsectionOracleFormComponent} from './bitcoin-subsection-oracle-form.component';

describe('BitcoinSubsectionOracleFormComponent', () => {
	let component: BitcoinSubsectionOracleFormComponent;
	let fixture: ComponentFixture<BitcoinSubsectionOracleFormComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [BitcoinSubsectionOracleFormComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(BitcoinSubsectionOracleFormComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
