/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Application Dependencies */
import {BitcoinUTXOracleModule} from '@server/modules/bitcoin/utxoracle/utxoracle.module';
import {CashuMintDatabaseModule} from '@server/modules/cashu/mintdb/cashumintdb.module';
import {ErrorModule} from '@server/modules/error/error.module';
import {MintService} from '@server/modules/api/mint/mint.service';
/* Internal Dependencies */
import {MintBalanceResolver} from './mintbalance.resolver';
import {MintBalanceService} from './mintbalance.service';

@Module({
	imports: [BitcoinUTXOracleModule, CashuMintDatabaseModule, ErrorModule],
	providers: [MintBalanceResolver, MintBalanceService, MintService],
})
export class MintBalanceModule {}
