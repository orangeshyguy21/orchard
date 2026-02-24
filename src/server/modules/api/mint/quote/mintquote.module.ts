/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Application Dependencies */
import {CashuMintRpcModule} from '@server/modules/cashu/mintrpc/cashumintrpc.module';
import {ErrorModule} from '@server/modules/error/error.module';
import {EventLogModule} from '@server/modules/event/event.module';
/* Local Dependencies */
import {MintQuoteService} from './mintquote.service';
import {MintQuoteResolver} from './mintquote.resolver';
import {MintQuoteInterceptor} from './mintquote.interceptor';

@Module({
	imports: [CashuMintRpcModule, ErrorModule, EventLogModule],
	providers: [MintQuoteResolver, MintQuoteService, MintQuoteInterceptor],
})
export class MintQuoteModule {}
