/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Application Dependencies */
import {CashuMintDatabaseModule} from '@server/modules/cashu/mintdb/cashumintdb.module';
import {CashuMintRpcModule} from '@server/modules/cashu/mintrpc/cashumintrpc.module';
import {ErrorModule} from '@server/modules/error/error.module';
import {ChangeModule} from '@server/modules/change/change.module';
import {MintService} from '@server/modules/api/mint/mint.service';
/* Local Dependencies */
import {MintKeysetService} from './mintkeyset.service';
import {MintKeysetResolver} from './mintkeyset.resolver';
import {MintKeysetInterceptor} from './mintkeyset.interceptor';

@Module({
	imports: [CashuMintDatabaseModule, CashuMintRpcModule, ErrorModule, ChangeModule],
	providers: [MintKeysetResolver, MintKeysetService, MintService, MintKeysetInterceptor],
})
export class MintKeysetModule {}
