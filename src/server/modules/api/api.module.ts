/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Local Dependencies */
import { StatusModule } from "./status/status.module";
import { MintInfoModule } from "./mintinfo/mintinfo.module";
import { MintBalanceModule } from "./mintbalance/mintbalance.module";
import { MintKeysetModule } from './mintkeyset/mintkeyset.module';
import { MintDatabaseModule } from "./mintdatabase/mintdatabase.module";
import { MintMeltQuoteModule } from "./mintmeltquote/mintmeltquote.module";
import { MintMintQuoteModule } from "./mintmintquote/mintmintquote.module";
import { MintPromiseModule } from "./mintpromise/mintpromise.module";
import { MintProofModule } from "./mintproof/mintproof.module";

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
  ],
})
export class ApiModule {}