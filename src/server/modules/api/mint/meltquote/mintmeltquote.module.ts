/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Application Dependencies */
import {CashuMintDatabaseModule} from '@server/modules/cashu/mintdb/cashumintdb.module';
import {CashuMintRpcModule} from '@server/modules/cashu/mintrpc/cashumintrpc.module';
import {CashuMintApiModule} from '@server/modules/cashu/mintapi/cashumintapi.module';
import {MintService} from '@server/modules/api/mint/mint.service';
import {ErrorModule} from '@server/modules/error/error.module';
import {ChangeModule} from '@server/modules/change/change.module';
/* Local Dependencies */
import {MintMeltQuoteService} from './mintmeltquote.service';
import {MintMeltQuoteResolver} from './mintmeltquote.resolver';
import {MintMeltQuoteInterceptor} from './mintmeltquote.interceptor';

@Module({
	imports: [CashuMintDatabaseModule, CashuMintRpcModule, CashuMintApiModule, ErrorModule, ChangeModule],
	providers: [MintMeltQuoteResolver, MintMeltQuoteService, MintService, MintMeltQuoteInterceptor],
})
export class MintMeltQuoteModule {}
