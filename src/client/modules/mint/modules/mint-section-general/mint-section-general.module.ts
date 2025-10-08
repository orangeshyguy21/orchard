/* Core Dependencies */
import {NgModule} from '@angular/core';
/* Vendor Dependencies */
import {MatIconModule} from '@angular/material/icon';
/* Local Dependencies */
import {MintSectionGeneralPaymentMethodComponent} from './components/mint-section-general-payment-method/mint-section-general-payment-method.component';

@NgModule({
	declarations: [MintSectionGeneralPaymentMethodComponent],
	imports: [MatIconModule],
	exports: [MintSectionGeneralPaymentMethodComponent],
})
export class OrcMintSectionGeneralModule {}
