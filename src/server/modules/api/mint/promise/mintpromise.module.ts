/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Application Dependencies */
import { CashuMintDatabaseModule } from "@server/modules/cashu/mintdb/cashumintdb.module";
import { MintService } from "@server/modules/api/mint/mint.service";
/* Local Dependencies */
import { MintPromiseService } from "./mintpromise.service";
import { MintPromiseResolver } from "./mintpromise.resolver";
 
@Module({
  imports: [
    CashuMintDatabaseModule,
  ],
  providers: [
    MintPromiseResolver,
    MintPromiseService,
    MintService,
  ]
})
export class MintPromiseModule {}
