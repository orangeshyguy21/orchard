/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Application Dependencies */
import {ErrorModule} from '@server/modules/error/error.module';
import {BitcoinUTXOracleModule} from '@server/modules/bitcoin/utxoracle/utxoracle.module';
/* Internal Dependencies */
import {BitcoinOracleResolver} from './btcoracle.resolver';
import {BitcoinOracleService} from './btcoracle.service';

@Module({
	imports: [ErrorModule, BitcoinUTXOracleModule],
	providers: [BitcoinOracleResolver, BitcoinOracleService],
})
export class BitcoinOracleModule {}
