/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Application Dependencies */
import {ErrorModule} from '@server/modules/error/error.module';
import {BitcoinRpcModule} from '@server/modules/bitcoin/rpc/btcrpc.module';
/* Internal Dependencies */
import {BitcoinMempoolResolver} from './btcmempool.resolver';
import {BitcoinMempoolService} from './btcmempool.service';

@Module({
	imports: [ErrorModule, BitcoinRpcModule],
	providers: [BitcoinMempoolResolver, BitcoinMempoolService],
})
export class BitcoinMempoolModule {}
