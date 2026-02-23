/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Application Dependencies */
import {CashuMintDatabaseModule} from '@server/modules/cashu/mintdb/cashumintdb.module';
import {MintService} from '@server/modules/api/mint/mint.service';
import {ErrorModule} from '@server/modules/error/error.module';
/* Local Dependencies */
import {MintPulseService} from './mintpulse.service';
import {MintPulseResolver} from './mintpulse.resolver';

@Module({
	imports: [CashuMintDatabaseModule, ErrorModule],
	providers: [MintPulseResolver, MintPulseService, MintService],
})
export class MintPulseModule {}
