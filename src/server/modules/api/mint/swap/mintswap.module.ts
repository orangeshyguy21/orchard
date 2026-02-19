/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Application Dependencies */
import {CashuMintDatabaseModule} from '@server/modules/cashu/mintdb/cashumintdb.module';
import {MintService} from '@server/modules/api/mint/mint.service';
import {ErrorModule} from '@server/modules/error/error.module';
/* Local Dependencies */
import {MintSwapService} from './mintswap.service';
import {MintSwapResolver} from './mintswap.resolver';

@Module({
	imports: [CashuMintDatabaseModule, ErrorModule],
	providers: [MintService, MintSwapService, MintSwapResolver],
})
export class MintSwapModule {}
