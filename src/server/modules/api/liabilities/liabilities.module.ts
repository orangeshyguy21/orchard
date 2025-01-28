/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Application Dependencies */
import { CashuModule } from "../../cashu/cashu.module";
import { LiabilitiesResolver } from "./liabilities.resolver";
import { LiabilitiesService } from "./liabilities.service";

@Module({
  imports: [
    CashuModule,
  ],
  providers: [
    LiabilitiesResolver,
    LiabilitiesService,
  ],
})
export class LiabilitiesModule {}