import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MintPaymentMethodComponent} from './mint-payment-method.component';

describe('MintPaymentMethodComponent', () => {
	let component: MintPaymentMethodComponent;
	let fixture: ComponentFixture<MintPaymentMethodComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintPaymentMethodComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintPaymentMethodComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
