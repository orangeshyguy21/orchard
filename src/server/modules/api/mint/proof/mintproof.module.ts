/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Application Dependencies */
import { CashuMintDatabaseModule } from "@server/modules/cashu/mintdb/cashumintdb.module";
import { MintService } from "@server/modules/api/mint/mint.service";
import { ErrorModule } from "@server/modules/error/error.module";
/* Local Dependencies */
import { MintProofService } from "./mintproof.service";
import { MintProofResolver } from "./mintproof.resolver";
 
@Module({
  imports: [
    CashuMintDatabaseModule,
    ErrorModule,
  ],
  providers: [
    MintProofResolver,
    MintProofService,
    MintService,
  ]
})
export class MintProofModule {}
