/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Local Dependencies */
// Orchard Endpoints
import { StatusModule } from "./status/status.module";
// Bitcoin Endpoints
import { BitcoinBlockCountModule } from "./bitcoin/blockcount/btcblockcount.module";
// Lightning Endpoints
import { LightningInfoModule } from "./lightning/info/lninfo.module";
import { LightningBalanceModule } from "./lightning/balance/lnbalance.module";
// Taproot Assets Endpoints
import { TaprootAssetsInfoModule } from "./tapass/info/tapinfo.module";
// Cashu Mint Endpoints
import { MintInfoModule } from "./mint/info/mintinfo.module";
import { MintBalanceModule } from "./mint/balance/mintbalance.module";
import { MintKeysetModule } from './mint/keyset/mintkeyset.module';
import { MintDatabaseModule } from "./mint/database/mintdatabase.module";
import { MintQuoteModule } from "./mint/quote/mintquote.module";
import { MintMeltQuoteModule } from "./mint/meltquote/mintmeltquote.module";
import { MintMintQuoteModule } from "./mint/mintquote/mintmintquote.module";
import { MintPromiseModule } from "./mint/promise/mintpromise.module";
import { MintProofModule } from "./mint/proof/mintproof.module";
import { MintAnalyticsModule } from "./mint/analytics/mintanalytics.module";
import { MintCountModule } from "./mint/count/mintcount.module";
// AI Endpoints
import { AiModelModule } from "./ai/model/aimodel.module";
import { AiChatModule } from "./ai/chat/aichat.module";
// Image Endpoints
import { PublicImageModule } from "./public/image/image.module";
import { PublicUrlModule } from "./public/url/url.module";

@Module({
	imports: [
		StatusModule,
		BitcoinBlockCountModule,
		LightningInfoModule,
		LightningBalanceModule,
		TaprootAssetsInfoModule,
		MintInfoModule,
		MintBalanceModule,
		MintKeysetModule,
		MintDatabaseModule,
		MintQuoteModule,
		MintMeltQuoteModule,
		MintMintQuoteModule,
		MintPromiseModule,
		MintProofModule,
		MintAnalyticsModule,
		MintCountModule,
		AiModelModule,
		AiChatModule,
		PublicImageModule,
		PublicUrlModule,
	],
})
export class ApiModule {}