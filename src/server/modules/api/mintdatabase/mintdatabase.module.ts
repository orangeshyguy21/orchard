/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Application Dependencies */
import { CashuMintDatabaseModule } from "@server/modules/cashu/mintdb/cashumintdb.module";
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
  ],
})
export class MintDatabaseModule {}

