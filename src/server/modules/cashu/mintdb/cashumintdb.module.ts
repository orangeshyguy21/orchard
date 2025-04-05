/* Core Dependencies */
import { Module } from '@nestjs/common';
/* Application Dependencies */
import { NutshellModule } from '@server/modules/cashu/nutshell/nutshell.module';
import { CdkModule } from '@server/modules/cashu/cdk/cdk.module';
/* Local Dependencies */
import { CashuMintDatabaseService } from './cashumintdb.service';

@Module({
	imports: [
		NutshellModule,
		CdkModule,
	],
	providers: [
		CashuMintDatabaseService,
	],
	exports: [
		CashuMintDatabaseService,
	],
})
export class CashuMintDatabaseModule {}
