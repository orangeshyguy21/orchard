/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Application Dependencies */
import {CashuMintRpcModule} from '@server/modules/cashu/mintrpc/cashumintrpc.module';
import {ErrorModule} from '@server/modules/error/error.module';
/* Local Dependencies */
import {MintQuoteService} from './mintquote.service';
import {MintQuoteResolver} from './mintquote.resolver';

@Module({
	imports: [CashuMintRpcModule, ErrorModule],
	providers: [MintQuoteResolver, MintQuoteService],
})
export class MintQuoteModule {}
