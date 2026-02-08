import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BitcoinGeneralInfoComponent} from './bitcoin-general-info.component';

describe('BitcoinGeneralInfoComponent', () => {
	let component: BitcoinGeneralInfoComponent;
	let fixture: ComponentFixture<BitcoinGeneralInfoComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [BitcoinGeneralInfoComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(BitcoinGeneralInfoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
