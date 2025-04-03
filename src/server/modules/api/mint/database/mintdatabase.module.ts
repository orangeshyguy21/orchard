/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Application Dependencies */
import { CashuMintDatabaseModule } from "@server/modules/cashu/mintdb/cashumintdb.module";
import { MintService } from "@server/modules/api/mint/mint.service";
/* Local Dependencies */
import { MintDatabaseResolver } from "./mintdatabase.resolver";
import { MintDatabaseService } from "./mintdatabase.service";

@Module({
  imports: [
    CashuMintDatabaseModule,
  ],
  providers: [
    MintDatabaseResolver,
    MintDatabaseService,
    MintService,
  ],
})
export class MintDatabaseModule {}

