/* Core Dependencies */
import { ChangeDetectionStrategy, Component } from '@angular/core';
/* Application Dependencies */
import { EnvConfig } from '@client/modules/settings/types/env.types';

@Component({
	selector: 'orc-mint-subsection-disabled',
	standalone: false,
	templateUrl: './mint-subsection-disabled.component.html',
	styleUrl: './mint-subsection-disabled.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionDisabledComponent {

	public type: 'nutshell' | 'cdk' = 'cdk';
	public env_configs: Record<string, EnvConfig> = {
		nutshell: {
			lines: [
				{ type: 'comment', value: '# Sample Mint .env' },
				{ type: 'variable', key: 'MINT_TYPE', value: 'nutshell' },
				{ type: 'variable', key: 'MINT_API', value: 'http://localhost:3888' },
				{ type: 'variable', key: 'MINT_DATABASE', value: '/path/to/database' }
			]
		},
		cdk: {
			lines: [
				{ type: 'comment', value: '# Sample Mint .env' },
				{ type: 'variable', key: 'MINT_TYPE', value: 'cdk' },
				{ type: 'variable', key: 'MINT_API', value: 'http://localhost:5551' },
				{ type: 'variable', key: 'MINT_DATABASE', value: '/path/to/database' },
				{ type: 'variable', key: 'MINT_RPC_HOST', value: 'localhost' },
				{ type: 'variable', key: 'MINT_RPC_PORT', value: '5552' },
				{ type: 'variable', key: 'MINT_RPC_KEY', value: '/path/to/client.key' },
				{ type: 'variable', key: 'MINT_RPC_CERT', value: '/path/to/client.pem' },
				{ type: 'variable', key: 'MINT_RPC_CA', value: '/path/to/ca.pem' }
			]
		}
	};

	public get env_config(): any {
		return this.env_configs[this.type];
	}

	constructor() {}
}