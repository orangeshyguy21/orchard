/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Application Dependencies */
import { CashuMintDatabaseModule } from "@server/modules/cashumintdb/cashumintdb.module";
/* Local Dependencies */
import { MintMeltQuoteService } from "./mintmeltquote.service";
import { MintMeltQuoteResolver } from "./mintmeltquote.resolver";
 
@Module({
  imports: [
    CashuMintDatabaseModule,
  ],
  providers: [
    MintMeltQuoteResolver,
    MintMeltQuoteService,
  ]
})
export class MintMeltQuoteModule {}
