/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Application Dependencies */
import { CashuMintDatabaseModule } from "@server/modules/cashu/mintdb/cashumintdb.module";
import { MintService } from "@server/modules/api/mint/mint.service";
/* Local Dependencies */
import { MintKeysetService } from "./mintkeyset.service";
import { MintKeysetResolver } from "./mintkeyset.resolver";

@Module({
  imports: [
    CashuMintDatabaseModule,
  ],
  providers: [
    MintKeysetResolver,
    MintKeysetService,
    MintService,
  ]
})
export class MintKeysetModule {}
