/* Core Dependencies */
import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
/* Application Dependencies */
import {CashuMintDatabaseModule} from '@server/modules/cashu/mintdb/cashumintdb.module';
import {ErrorModule} from '@server/modules/error/error.module';
import {MintService} from '@server/modules/api/mint/mint.service';
/* Local Dependencies */
import {MintMonitorService} from './mintmonitor.service';
import {MintMonitorResolver} from './mintmonitor.resolver';

@Module({
	imports: [ConfigModule, CashuMintDatabaseModule, ErrorModule],
	providers: [MintMonitorResolver, MintMonitorService, MintService],
})
export class MintMonitorModule {}
