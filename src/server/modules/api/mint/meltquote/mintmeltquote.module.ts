/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Application Dependencies */
import { CashuMintDatabaseModule } from "@server/modules/cashu/mintdb/cashumintdb.module";
import { MintService } from "@server/modules/api/mint/mint.service";
import { ErrorModule } from "@server/modules/error/error.module";
/* Local Dependencies */
import { MintMeltQuoteService } from "./mintmeltquote.service";
import { MintMeltQuoteResolver } from "./mintmeltquote.resolver";
 
@Module({
	imports: [
		CashuMintDatabaseModule,
		ErrorModule,
	],
	providers: [
		MintMeltQuoteResolver,
		MintMeltQuoteService,
		MintService,
	]
})
export class MintMeltQuoteModule {}
