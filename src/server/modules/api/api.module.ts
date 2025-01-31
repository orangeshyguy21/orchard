/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Application Dependencies */
import { StatusModule } from "./status/status.module";
import { MintInfoModule } from "./mintinfo/mintinfo.module";
import { MintBalanceModule } from "./mintbalance/mintbalance.module";
import { MintKeysetModule } from './mintkeyset/mintkeyset.module';

@Module({
  imports: [
    StatusModule,
    MintInfoModule,
    MintBalanceModule,
    MintKeysetModule,
  ],
})
export class ApiModule {}