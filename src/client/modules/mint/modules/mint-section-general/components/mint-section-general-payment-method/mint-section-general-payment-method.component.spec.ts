/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatIconTestingModule} from '@angular/material/icon/testing';
/* Native Dependencies */
import {OrcMintSectionGeneralModule} from '@client/modules/mint/modules/mint-section-general/mint-section-general.module';
/* Shared Dependencies */

/* Local Dependencies */
import {MintSectionGeneralPaymentMethodComponent} from './mint-section-general-payment-method.component';

describe('MintSectionGeneralPaymentMethodComponent', () => {
	let component: MintSectionGeneralPaymentMethodComponent;
	let fixture: ComponentFixture<MintSectionGeneralPaymentMethodComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSectionGeneralModule, MatIconTestingModule],
			declarations: [MintSectionGeneralPaymentMethodComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSectionGeneralPaymentMethodComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('payment_method', 'bolt11');
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
