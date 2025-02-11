/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Application Dependencies */
import { StatusModule } from "./status/status.module";
import { MintInfoModule } from "./mintinfo/mintinfo.module";
import { MintBalanceModule } from "./mintbalance/mintbalance.module";
import { MintKeysetModule } from './mintkeyset/mintkeyset.module';
import { MintDatabaseModule } from "./mintdatabase/mintdatabase.module";
import { MintMeltQuoteModule } from "./mintmeltquote/mintmeltquote.rmodule";

@Module({
  imports: [
    StatusModule,
    MintInfoModule,
    MintBalanceModule,
    MintKeysetModule,
    MintDatabaseModule,
    MintMeltQuoteModule,
  ],
})
export class ApiModule {}