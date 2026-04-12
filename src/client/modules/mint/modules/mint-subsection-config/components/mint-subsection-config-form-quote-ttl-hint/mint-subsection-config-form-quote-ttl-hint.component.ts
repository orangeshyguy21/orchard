/* Core Dependencies */
import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';

@Component({
	selector: 'orc-mint-subsection-config-form-quote-ttl-hint',
	standalone: false,
	templateUrl: './mint-subsection-config-form-quote-ttl-hint.component.html',
	styleUrl: './mint-subsection-config-form-quote-ttl-hint.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionConfigFormQuoteTtlHintComponent {
	public quote_ttl = input.required<number>();

	public duration = computed(() => {
		const seconds = this.quote_ttl();
		if (!seconds || seconds <= 0) return '';
		if (seconds < 120) {
			const rounded = Math.round(seconds);
			return `${rounded} ${rounded === 1 ? 'second' : 'seconds'}`;
		} else if (seconds < 3600) {
			const minutes = Math.round(seconds / 60);
			return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
		} else if (seconds < 86400) {
			const hours = Math.round(seconds / 3600);
			return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
		} else {
			const days = Math.round(seconds / 86400);
			return `${days} ${days === 1 ? 'day' : 'days'}`;
		}
	});
}
