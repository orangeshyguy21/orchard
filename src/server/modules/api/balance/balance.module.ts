/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Application Dependencies */
import { CashuModule } from "../../cashu/cashu.module";
import { BalanceResolver } from "./balance.resolver";
import { BalanceService } from "./balance.service";

@Module({
  imports: [
    CashuModule,
  ],
  providers: [
    BalanceResolver,
    BalanceService,
  ],
})
export class BalanceModule {}