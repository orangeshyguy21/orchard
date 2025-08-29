/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Application Dependencies */
import {BitcoinRpcModule} from '@server/modules/bitcoin/rpc/btcrpc.module';
/* Local Dependencies */
import {BitcoinUTXOracleService} from './utxoracle.service';

@Module({
	imports: [BitcoinRpcModule],
	providers: [BitcoinUTXOracleService],
	exports: [BitcoinUTXOracleService],
})
export class BitcoinUTXOracleModule {}
