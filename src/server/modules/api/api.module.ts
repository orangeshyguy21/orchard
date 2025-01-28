/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Application Dependencies */
import { StatusModule } from "./status/status.module";
import { LiabilitiesModule } from "./liabilities/liabilities.module";
import { KeysetModule } from './keyset/keyset.module';

@Module({
  imports: [
    StatusModule,
    LiabilitiesModule,
    KeysetModule,
  ],
})
export class ApiModule {}