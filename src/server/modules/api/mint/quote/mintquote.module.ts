/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Application Dependencies */
import {CashuMintRpcModule} from '@server/modules/cashu/mintrpc/cashumintrpc.module';
import {ErrorModule} from '@server/modules/error/error.module';
import {ChangeModule} from '@server/modules/change/change.module';
/* Local Dependencies */
import {MintQuoteService} from './mintquote.service';
import {MintQuoteResolver} from './mintquote.resolver';
import {MintQuoteInterceptor} from './mintquote.interceptor';

@Module({
	imports: [CashuMintRpcModule, ErrorModule, ChangeModule],
	providers: [MintQuoteResolver, MintQuoteService, MintQuoteInterceptor],
})
export class MintQuoteModule {}
