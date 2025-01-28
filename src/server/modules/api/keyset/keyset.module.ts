/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Application Dependencies */
import { CashuModule } from "../../cashu/cashu.module";
import { KeysetService } from "./keyset.service";
import { KeysetResolver } from "./keyset.resolver";

@Module({
  imports: [
    CashuModule,
  ],
  providers: [
    KeysetResolver,
    KeysetService,
  ]
})
export class KeysetModule {}
