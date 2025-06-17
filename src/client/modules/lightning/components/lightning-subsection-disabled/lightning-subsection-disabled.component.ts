/* Core Dependencies */
import { ChangeDetectionStrategy, Component } from '@angular/core';
/* Application Dependencies */
import { EnvConfig } from '@client/modules/settings/types/env.types';

@Component({
  selector: 'orc-lightning-subsection-disabled',
  standalone: false,
  templateUrl: './lightning-subsection-disabled.component.html',
  styleUrl: './lightning-subsection-disabled.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LightningSubsectionDisabledComponent {

	// public env_configs: Record<string, EnvConfig> = {
	// 	lnd: {
	// 		lines: [
	// 			{ type: 'comment', value: '# Sample Lightning .env' },
	// 		]
	// 	}
	// }

	public env_config_lightning: EnvConfig = {
		lines: [
			{ type: 'comment', value: '# Sample Lightning .env' },
			{ type: 'variable', key: 'LIGHTNING_TYPE', value: 'lnd' },
			{ type: 'variable', key: 'LIGHTNING_RPC_HOST', value: 'localhost' },
			{ type: 'variable', key: 'LIGHTNING_RPC_PORT', value: '8447' },
			{ type: 'variable', key: 'LIGHTNING_MACAROON', value: 'path/to/macaroon' },
			{ type: 'variable', key: 'LIGHTNING_CERT', value: 'path/to/cert' },
		]
	}

	public env_config_taproot_assets: EnvConfig = {
		lines: [
			{ type: 'comment', value: '# Sample Taproot Assets .env' },
			{ type: 'variable', key: 'TAPROOT_ASSETS_TYPE', value: 'tapd' },
			{ type: 'variable', key: 'TAPROOT_ASSETS_RPC_HOST', value: 'localhost' },
			{ type: 'variable', key: 'TAPROOT_ASSETS_RPC_PORT', value: '8447' },
			{ type: 'variable', key: 'TAPROOT_ASSETS_MACAROON', value: 'path/to/macaroon' },
			{ type: 'variable', key: 'TAPROOT_ASSETS_CERT', value: 'path/to/cert' },
		]
	}

	constructor() {}
	
}
