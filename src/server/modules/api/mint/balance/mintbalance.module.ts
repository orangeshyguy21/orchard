/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Application Dependencies */
import { CashuMintDatabaseModule } from "@server/modules/cashu/mintdb/cashumintdb.module";
import { MintService } from "@server/modules/api/mint/mint.service";
/* Internal Dependencies */
import { MintBalanceResolver } from "./mintbalance.resolver";
import { MintBalanceService } from "./mintbalance.service";

@Module({
	imports: [
		CashuMintDatabaseModule,
	],
	providers: [
		MintBalanceResolver,
		MintBalanceService,
		MintService,
	],
})
export class MintBalanceModule {}
