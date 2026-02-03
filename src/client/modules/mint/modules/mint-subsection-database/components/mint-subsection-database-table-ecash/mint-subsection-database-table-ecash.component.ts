/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, OnInit} from '@angular/core';
/* Application Dependencies */
import {MintProofGroup} from '@client/modules/mint/classes/mint-proof-group.class';
import {MintPromiseGroup} from '@client/modules/mint/classes/mint-promise-group.class';
import {MintKeyset} from '@client/modules/mint/classes/mint-keyset.class';

@Component({
	selector: 'orc-mint-subsection-database-table-ecash',
	standalone: false,
	templateUrl: './mint-subsection-database-table-ecash.component.html',
	styleUrl: './mint-subsection-database-table-ecash.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionDatabaseTableEcashComponent implements OnInit {
	public group = input.required<MintProofGroup | MintPromiseGroup>();
	public keysets = input.required<MintKeyset[]>();
    public bitcoin_oracle_amount = input.required<number | null>();

	public group_amounts: {keyset: MintKeyset | undefined; notes: {amount: number; quantity: number}[]}[] = [];

	ngOnInit(): void {
		this.group_amounts = this.group().keyset_ids.map((keyset_id, index) => {
			return {
				keyset: this.keysets().find((keyset) => keyset.id === keyset_id),
				notes: this.countAmounts(this.group().amounts[index]) || [],
			};
		});
	}

	private countAmounts(amounts: number[]): {amount: number; quantity: number}[] {
		return Array.from(
			amounts.reduce((acc, amount) => {
				acc.set(amount, (acc.get(amount) || 0) + 1);
				return acc;
			}, new Map<number, number>()),
		)
			.map(([amount, quantity]) => ({amount, quantity}))
			.sort((a, b) => b.amount - a.amount);
	}
}
