/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input} from '@angular/core';
/* Application Dependencies */
import {LightningInfo} from '@client/modules/lightning/classes/lightning-info.class';
import {LightningChannel, LightningClosedChannel} from '@client/modules/lightning/classes/lightning-channel.class';
import {TaprootAssets} from '@client/modules/tapass/classes/taproot-assets.class';
import {BitcoinOraclePrice} from '@client/modules/bitcoin/classes/bitcoin-oracle-price.class';
import {DeviceType} from '@client/modules/layout/types/device.types';
import {OrchardError} from '@client/modules/error/types/error.types';

@Component({
	selector: 'orc-index-subsection-dashboard-lightning-enabled',
	standalone: false,
	templateUrl: './index-subsection-dashboard-lightning-enabled.component.html',
	styleUrl: './index-subsection-dashboard-lightning-enabled.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexSubsectionDashboardLightningEnabledComponent {
	public loading = input.required<boolean>();
	public bitcoin_oracle_enabled = input.required<boolean>();
	public bitcoin_oracle_price = input.required<BitcoinOraclePrice | null>();
	public enabled_taproot_assets = input.required<boolean>();
	public lightning_info = input.required<LightningInfo | null>();
	public lightning_channels = input.required<LightningChannel[] | null>();
	public lightning_closed_channels = input.required<LightningClosedChannel[] | null>();
	public taproot_assets = input.required<TaprootAssets | null>();
	public device_type = input.required<DeviceType>();
	public errors_lightning = input.required<OrchardError[]>();
}
