/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Application Dependencies */
import { CashuMintDatabaseModule } from "@server/modules/cashu/mintdb/cashumintdb.module";
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
  ],
})
export class MintBalanceModule {}
