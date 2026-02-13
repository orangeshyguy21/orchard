/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Application Dependencies */
import {ErrorModule} from '@server/modules/error/error.module';
import {BitcoinRpcModule} from '@server/modules/bitcoin/rpc/btcrpc.module';
import {LightningModule} from '@server/modules/lightning/lightning/lightning.module';
/* Internal Dependencies */
import {BitcoinNetworkResolver} from './btcnetwork.resolver';
import {BitcoinNetworkService} from './btcnetwork.service';

@Module({
	imports: [ErrorModule, BitcoinRpcModule, LightningModule],
	providers: [BitcoinNetworkResolver, BitcoinNetworkService],
})
export class BitcoinNetworkModule {}
