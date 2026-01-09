/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, effect, signal} from '@angular/core';

@Component({
	selector: 'orc-mint-subsection-config-form-limit-hint',
	standalone: false,
	templateUrl: './mint-subsection-config-form-limit-hint.component.html',
	styleUrl: './mint-subsection-config-form-limit-hint.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionConfigFormLimitHintComponent {
	public limit = input.required<number>();
	public amounts = input.required<Record<string, number>[]>();
	public type = input.required<'min' | 'max'>();

	public limit_hint = signal<number | null>(null);

	constructor() {
		effect(() => {
			const limit = this.limit();
			// console.log('limit', limit);
			// console.log('amounts', this.amounts());
			// console.log('type', this.type());
			if (limit) this.setHint();
		});
	}

	private setHint(): void {
		const hint = this.getHint(this.amounts());
		this.limit_hint.set(hint);
	}

	private getHint(amounts: Record<string, number>[]): number {
		const values = amounts.map((amount) => amount['amount']);
		if (this.type() === 'min') {
			return values.filter((value) => value < this.limit()).length;
		}
		return values.filter((value) => value > this.limit()).length;
	}
}
