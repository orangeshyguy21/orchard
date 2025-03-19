/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Application Dependencies */
import { CashuMintDatabaseModule } from "@server/modules/cashu/mintdb/cashumintdb.module";
import { MintService } from "@server/modules/api/mint/mint.service";
/* Local Dependencies */
import { MintMintQuoteService } from "./mintmintquote.service";
import { MintMintQuoteResolver } from "./mintmintquote.resolver";
 
@Module({
  imports: [
    CashuMintDatabaseModule,
  ],
  providers: [
    MintMintQuoteResolver,
    MintMintQuoteService,
    MintService,
  ]
})
export class MintMintQuoteModule {}
