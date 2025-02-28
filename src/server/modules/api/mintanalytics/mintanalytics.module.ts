/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Application Dependencies */
import { CashuMintDatabaseModule } from "@server/modules/cashumintdb/cashumintdb.module";
/* Internal Dependencies */
import { MintAnalyticsResolver } from "./mintanalytics.resolver";
import { MintAnalyticsService } from "./mintanalytics.service";

@Module({
	imports: [
		CashuMintDatabaseModule,
	],
	providers: [
		MintAnalyticsResolver,
		MintAnalyticsService,
	],
})
export class MintAnalyticsModule {}
