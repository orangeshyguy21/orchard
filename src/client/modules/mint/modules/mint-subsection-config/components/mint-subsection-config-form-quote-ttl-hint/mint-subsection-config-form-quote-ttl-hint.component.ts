/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, effect, signal} from '@angular/core';

@Component({
	selector: 'orc-mint-subsection-config-form-quote-ttl-hint',
	standalone: false,
	templateUrl: './mint-subsection-config-form-quote-ttl-hint.component.html',
	styleUrl: './mint-subsection-config-form-quote-ttl-hint.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionConfigFormQuoteTtlHintComponent {
	public deltas = input.required<Record<string, number>[]>();
	public quote_ttl = input.required<number>();

	public coverage = signal<number | null>(null);

	constructor() {
		effect(() => {
			const quote_ttl = this.quote_ttl();
			if (quote_ttl) this.setCoverage();
		});
	}

	private setCoverage(): void {
		const coverage = this.getCoverage(this.deltas());
		this.coverage.set(coverage);
	}

	private getCoverage(deltas: Record<string, number>[]): number {
		const values = deltas.map((delta) => delta['delta']);
		const values_under_ttl = values.filter((value) => value <= this.quote_ttl());
		return (values_under_ttl.length / values.length) * 100 || 0;
	}
}
