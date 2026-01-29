/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Application Dependencies */
import {BitcoinUTXOracleModule} from '@server/modules/bitcoin/utxoracle/utxoracle.module';
import {CashuMintDatabaseModule} from '@server/modules/cashu/mintdb/cashumintdb.module';
import {CashuMintRpcModule} from '@server/modules/cashu/mintrpc/cashumintrpc.module';
import {ErrorModule} from '@server/modules/error/error.module';
import {MintService} from '@server/modules/api/mint/mint.service';
/* Local Dependencies */
import {MintKeysetService} from './mintkeyset.service';
import {MintKeysetResolver} from './mintkeyset.resolver';

@Module({
	imports: [BitcoinUTXOracleModule, CashuMintDatabaseModule, CashuMintRpcModule, ErrorModule],
	providers: [MintKeysetResolver, MintKeysetService, MintService],
})
export class MintKeysetModule {}
