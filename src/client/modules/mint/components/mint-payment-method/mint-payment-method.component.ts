/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input} from '@angular/core';
/* Shared Dependencies */
import {MintPaymentMethod} from '@shared/generated.types';

@Component({
	selector: 'orc-mint-payment-method',
	standalone: false,
	templateUrl: './mint-payment-method.component.html',
	styleUrl: './mint-payment-method.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintPaymentMethodComponent {
	public payment_method = input.required<MintPaymentMethod>();
	public icon_size = input<string>('icon-sm');
}
