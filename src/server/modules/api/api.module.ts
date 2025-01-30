/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Application Dependencies */
import { StatusModule } from "./status/status.module";
import { MintModule } from "./mint/mint.module";
import { BalanceModule } from "./balance/balance.module";
import { KeysetModule } from './keyset/keyset.module';

@Module({
  imports: [
    StatusModule,
    MintModule,
    BalanceModule,
    KeysetModule,
  ],
})
export class ApiModule {}