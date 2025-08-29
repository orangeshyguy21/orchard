/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Application Dependencies */
import {BitcoinRpcModule} from '@server/modules/bitcoin/rpc/btcrpc.module';
/* Local Dependencies */
import {BitcoinOracleService} from './oracle.service';

@Module({
	imports: [BitcoinRpcModule],
	providers: [BitcoinOracleService],
	exports: [BitcoinOracleService],
})
export class BitcoinOracleModule {}
