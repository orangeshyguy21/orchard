/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Application Dependencies */
import { CashuModule } from "../../cashu/cashu.module";
import { MintService } from "./mint.service";
import { MintResolver } from "./mint.resolver";

@Module({
  imports: [
    CashuModule,
  ],
  providers: [
    MintResolver,
    MintService,
  ]
})
export class MintModule {}
