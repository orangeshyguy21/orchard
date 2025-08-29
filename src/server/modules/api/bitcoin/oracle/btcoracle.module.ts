/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Application Dependencies */
import {ErrorModule} from '@server/modules/error/error.module';
import {BitcoinOracleModule as CoreBitcoinOracleModule} from '@server/modules/bitcoin/oracle/oracle.module';
/* Internal Dependencies */
import {BitcoinOracleResolver} from './btcoracle.resolver';
import {BitcoinOracleApiService} from './btcoracle.service';

@Module({
	imports: [ErrorModule, CoreBitcoinOracleModule],
	providers: [BitcoinOracleResolver, BitcoinOracleApiService],
})
export class BitcoinOracleModule {}
