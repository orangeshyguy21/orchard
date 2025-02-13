/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Application Dependencies */
import { CashuMintDatabaseModule } from "@server/modules/cashumintdb/cashumintdb.module";
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
  ]
})
export class MintPromiseModule {}
