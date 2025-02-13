/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Application Dependencies */
import { CashuMintDatabaseModule } from "@server/modules/cashumintdb/cashumintdb.module";
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
  ]
})
export class MintKeysetModule {}
