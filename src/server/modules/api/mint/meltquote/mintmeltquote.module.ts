/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Application Dependencies */
import {CashuMintDatabaseModule} from '@server/modules/cashu/mintdb/cashumintdb.module';
import {CashuMintRpcModule} from '@server/modules/cashu/mintrpc/cashumintrpc.module';
import {MintService} from '@server/modules/api/mint/mint.service';
import {ErrorModule} from '@server/modules/error/error.module';
/* Local Dependencies */
import {MintMeltQuoteService} from './mintmeltquote.service';
import {MintMeltQuoteResolver} from './mintmeltquote.resolver';

@Module({
	imports: [CashuMintDatabaseModule, CashuMintRpcModule, ErrorModule],
	providers: [MintMeltQuoteResolver, MintMeltQuoteService, MintService],
})
export class MintMeltQuoteModule {}
