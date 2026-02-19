/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, computed} from '@angular/core';
/* Application Dependencies */
import {MintSwap} from '@client/modules/mint/classes/mint-swap.class';
import {MintKeyset} from '@client/modules/mint/classes/mint-keyset.class';

@Component({
	selector: 'orc-mint-subsection-database-table-swap',
	standalone: false,
	templateUrl: './mint-subsection-database-table-swap.component.html',
	styleUrl: './mint-subsection-database-table-swap.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionDatabaseTableSwapComponent {
	public swap = input.required<MintSwap>();
	public keysets = input.required<MintKeyset[]>();
	public bitcoin_oracle_data = input.required<{price_cents: number; date: number} | null>();
	public device_desktop = input.required<boolean>();

	public involved_keysets = computed(() => {
		return this.keysets().filter((keyset) => this.swap().keyset_ids.includes(keyset.id));
	});
}
