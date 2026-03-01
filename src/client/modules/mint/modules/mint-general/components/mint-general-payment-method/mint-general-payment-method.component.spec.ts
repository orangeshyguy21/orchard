/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatIconTestingModule} from '@angular/material/icon/testing';
/* Native Dependencies */
import {OrcMintGeneralModule} from '@client/modules/mint/modules/mint-general/mint-general.module';
/* Shared Dependencies */

/* Local Dependencies */
import {MintGeneralPaymentMethodComponent} from './mint-general-payment-method.component';

describe('MintGeneralPaymentMethodComponent', () => {
	let component: MintGeneralPaymentMethodComponent;
	let fixture: ComponentFixture<MintGeneralPaymentMethodComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintGeneralModule, MatIconTestingModule],
			declarations: [MintGeneralPaymentMethodComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintGeneralPaymentMethodComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('payment_method', 'bolt11');
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
