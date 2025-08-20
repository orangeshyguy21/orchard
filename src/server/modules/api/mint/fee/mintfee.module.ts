/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Application Dependencies */
import {CashuMintDatabaseModule} from '@server/modules/cashu/mintdb/cashumintdb.module';
import {ErrorModule} from '@server/modules/error/error.module';
import {MintService} from '@server/modules/api/mint/mint.service';
/* Internal Dependencies */
import {MintFeeResolver} from './mintfee.resolver';
import {MintfeeService} from './mintfee.service';

@Module({
	imports: [CashuMintDatabaseModule, ErrorModule],
	providers: [MintFeeResolver, MintfeeService, MintService],
})
export class MintFeeModule {}
