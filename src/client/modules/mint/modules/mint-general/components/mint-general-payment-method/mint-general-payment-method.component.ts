/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input} from '@angular/core';
/* Shared Dependencies */

@Component({
	selector: 'orc-mint-general-payment-method',
	standalone: false,
	templateUrl: './mint-general-payment-method.component.html',
	styleUrl: './mint-general-payment-method.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintGeneralPaymentMethodComponent {
	public payment_method = input.required<string>();
	public icon_size = input<string>('icon-sm');
}
