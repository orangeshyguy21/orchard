/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Application Dependencies */
import { CashuMintDatabaseModule } from "@server/modules/cashu/mintdb/cashumintdb.module";
import { MintService } from "@server/modules/api/mint/mint.service";
import { ErrorModule } from "@server/modules/error/error.module";
/* Local Dependencies */
import { MintMintQuoteService } from "./mintmintquote.service";
import { MintMintQuoteResolver } from "./mintmintquote.resolver";
 
@Module({
  imports: [
    CashuMintDatabaseModule,
    ErrorModule,
  ],
  providers: [
    MintMintQuoteResolver,
    MintMintQuoteService,
    MintService,
  ]
})
export class MintMintQuoteModule {}
