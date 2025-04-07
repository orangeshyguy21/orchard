/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Local Dependencies */
import { StatusModule } from "./status/status.module";
import { MintInfoModule } from "./mint/info/mintinfo.module";
import { MintBalanceModule } from "./mint/balance/mintbalance.module";
import { MintKeysetModule } from './mint/keyset/mintkeyset.module';
import { MintDatabaseModule } from "./mint/database/mintdatabase.module";
import { MintMeltQuoteModule } from "./mint/meltquote/mintmeltquote.module";
import { MintMintQuoteModule } from "./mint/mintquote/mintmintquote.module";
import { MintPromiseModule } from "./mint/promise/mintpromise.module";
import { MintProofModule } from "./mint/proof/mintproof.module";
import { MintAnalyticsModule } from "./mint/analytics/mintanalytics.module";
import { BitcoinBlockCountModule } from "./bitcoin/blockcount/blockcount.module";

@Module({
  imports: [
    StatusModule,
    MintInfoModule,
    MintBalanceModule,
    MintKeysetModule,
    MintDatabaseModule,
    MintMeltQuoteModule,
    MintMintQuoteModule,
    MintPromiseModule,
    MintProofModule,
    MintAnalyticsModule,
    BitcoinBlockCountModule,
  ]
})
export class ApiModule {}