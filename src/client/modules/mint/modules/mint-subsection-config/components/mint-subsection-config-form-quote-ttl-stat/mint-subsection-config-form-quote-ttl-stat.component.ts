/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input} from '@angular/core';

@Component({
	selector: 'orc-mint-subsection-config-form-quote-ttl-stat',
	standalone: false,
	templateUrl: './mint-subsection-config-form-quote-ttl-stat.component.html',
	styleUrl: './mint-subsection-config-form-quote-ttl-stat.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionConfigFormQuoteTtlStatComponent {
	public loading = input.required<boolean>();
}
