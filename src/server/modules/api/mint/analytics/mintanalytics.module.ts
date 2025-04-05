/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Application Dependencies */
import { CashuMintDatabaseModule } from "@server/modules/cashu/mintdb/cashumintdb.module";
import { ErrorModule } from "@server/modules/error/error.module";
import { MintService } from "@server/modules/api/mint/mint.service";
/* Internal Dependencies */
import { MintAnalyticsResolver } from "./mintanalytics.resolver";
import { MintAnalyticsService } from "./mintanalytics.service";

@Module({
	imports: [
		CashuMintDatabaseModule,
		ErrorModule,
	],
	providers: [
		MintAnalyticsResolver,
		MintAnalyticsService,
		MintService,
	],
})
export class MintAnalyticsModule {}
