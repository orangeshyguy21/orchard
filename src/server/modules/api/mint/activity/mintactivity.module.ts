/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Application Dependencies */
import {CashuMintDatabaseModule} from '@server/modules/cashu/mintdb/cashumintdb.module';
import {ErrorModule} from '@server/modules/error/error.module';
import {MintService} from '@server/modules/api/mint/mint.service';
/* Internal Dependencies */
import {MintActivityResolver} from './mintactivity.resolver';
import {MintActivityService} from './mintactivity.service';

@Module({
	imports: [CashuMintDatabaseModule, ErrorModule],
	providers: [MintActivityResolver, MintActivityService, MintService],
})
export class MintActivityModule {}
