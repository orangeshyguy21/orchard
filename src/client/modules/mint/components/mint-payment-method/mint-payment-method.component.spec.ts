/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Vendor Dependencies */
import {MintAppModule} from '@client/modules/mint/mint.app.module';
/* Local Dependencies */
import {MintPaymentMethodComponent} from './mint-payment-method.component';

describe('MintPaymentMethodComponent', () => {
	let component: MintPaymentMethodComponent;
	let fixture: ComponentFixture<MintPaymentMethodComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintPaymentMethodComponent],
			imports: [MintAppModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintPaymentMethodComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('payment_method', 'bolt11');
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
