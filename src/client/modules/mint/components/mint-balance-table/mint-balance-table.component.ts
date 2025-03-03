/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
/* Application Dependencies */
import { MintBalance } from '@client/modules/mint/classes/mint-balance.class';
import { MintKeyset } from '@client/modules/mint/classes/mint-keyset.class';

@Component({
	selector: 'orc-mint-balance-table',
	standalone: false,
	templateUrl: './mint-balance-table.component.html',
	styleUrl: './mint-balance-table.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintBalanceTableComponent {
	@Input() balances: MintBalance[] = [];
	@Input() keysets: MintKeyset[] = [];
}