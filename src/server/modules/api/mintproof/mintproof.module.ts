/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Application Dependencies */
import { CashuMintDatabaseModule } from "../../cashumintdb/cashumintdb.module";
/* Local Dependencies */
import { MintProofService } from "./mintproof.service";
import { MintProofResolver } from "./mintproof.resolver";
 
@Module({
  imports: [
    CashuMintDatabaseModule,
  ],
  providers: [
    MintProofResolver,
    MintProofService,
  ]
})
export class MintProofModule {}
