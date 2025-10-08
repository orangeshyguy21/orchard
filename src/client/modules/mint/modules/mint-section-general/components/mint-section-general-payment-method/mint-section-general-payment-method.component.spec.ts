/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSectionGeneralPaymentMethodComponent} from './mint-section-general-payment-method.component';

describe('MintSectionGeneralPaymentMethodComponent', () => {
	let component: MintSectionGeneralPaymentMethodComponent;
	let fixture: ComponentFixture<MintSectionGeneralPaymentMethodComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSectionGeneralPaymentMethodComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSectionGeneralPaymentMethodComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
