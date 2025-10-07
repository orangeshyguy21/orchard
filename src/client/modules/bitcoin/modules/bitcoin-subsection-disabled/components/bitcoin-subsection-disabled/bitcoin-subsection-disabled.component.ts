/* Core Dependencies */
import {ChangeDetectionStrategy, Component} from '@angular/core';
/* Application Dependencies */
import {EnvConfig} from '@client/modules/settings/types/env.types';

@Component({
	selector: 'orc-bitcoin-subsection-disabled',
	standalone: false,
	templateUrl: './bitcoin-subsection-disabled.component.html',
	styleUrl: './bitcoin-subsection-disabled.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BitcoinSubsectionDisabledComponent {
	public env_config: EnvConfig = {
		lines: [
			{type: 'comment', value: '# Sample Bitcoin .env'},
			{type: 'variable', key: 'BITCOIN_TYPE', value: 'core'},
			{type: 'variable', key: 'BITCOIN_RPC_HOST', value: 'localhost'},
			{type: 'variable', key: 'BITCOIN_RPC_PORT', value: '8332'},
			{type: 'variable', key: 'BITCOIN_RPC_USER', value: 'rpcuser'},
			{type: 'variable', key: 'BITCOIN_RPC_PASSWORD', value: 'rpcpass'},
		],
	};

	constructor() {}
}
