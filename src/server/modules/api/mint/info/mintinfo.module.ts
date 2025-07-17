/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Application Dependencies */
import {CashuMintApiModule} from '@server/modules/cashu/mintapi/cashumintapi.module';
import {CashuMintRpcModule} from '@server/modules/cashu/mintrpc/cashumintrpc.module';
import {ErrorModule} from '@server/modules/error/error.module';
/* Local Dependencies */
import {MintInfoService} from './mintinfo.service';
import {MintInfoResolver} from './mintinfo.resolver';

@Module({
	imports: [CashuMintApiModule, CashuMintRpcModule, ErrorModule],
	providers: [MintInfoResolver, MintInfoService],
})
export class MintInfoModule {}
