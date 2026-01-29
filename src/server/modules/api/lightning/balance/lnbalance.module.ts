/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Application Dependencies */
import {ErrorModule} from '@server/modules/error/error.module';
import {BitcoinUTXOracleModule} from '@server/modules/bitcoin/utxoracle/utxoracle.module';
import {LightningModule} from '@server/modules/lightning/lightning/lightning.module';
/* Local Dependencies */
import {LightningBalanceService} from './lnbalance.service';
import {LightningBalanceResolver} from './lnbalance.resolver';

@Module({
	imports: [ BitcoinUTXOracleModule, LightningModule, ErrorModule],
	providers: [LightningBalanceService, LightningBalanceResolver],
})
export class LightningBalanceModule {}
