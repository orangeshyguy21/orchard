/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Local Dependencies */
// Orchard Endpoints
import { StatusModule } from "./status/status.module";
// Bitcoin Endpoints
import { BitcoinBlockCountModule } from "./bitcoin/blockcount/btcblockcount.module";
// Cashu Mint Endpoints
import { MintInfoModule } from "./mint/info/mintinfo.module";
import { MintBalanceModule } from "./mint/balance/mintbalance.module";
import { MintKeysetModule } from './mint/keyset/mintkeyset.module';
import { MintDatabaseModule } from "./mint/database/mintdatabase.module";
import { MintMeltQuoteModule } from "./mint/meltquote/mintmeltquote.module";
import { MintMintQuoteModule } from "./mint/mintquote/mintmintquote.module";
import { MintPromiseModule } from "./mint/promise/mintpromise.module";
import { MintProofModule } from "./mint/proof/mintproof.module";
import { MintAnalyticsModule } from "./mint/analytics/mintanalytics.module";
// AI Endpoints
import { AiModelModule } from "./ai/model/aimodel.module";
import { AiChatModule } from "./ai/chat/aichat.module";

@Module({
	imports: [
		StatusModule,
		BitcoinBlockCountModule,
		MintInfoModule,
		MintBalanceModule,
		MintKeysetModule,
		MintDatabaseModule,
		MintMeltQuoteModule,
		MintMintQuoteModule,
		MintPromiseModule,
		MintProofModule,
		MintAnalyticsModule,
		AiModelModule,
		AiChatModule,
	],
})
export class ApiModule {}