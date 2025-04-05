/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Application Dependencies */
import { CashuMintApiModule } from "@server/modules/cashu/mintapi/cashumintapi.module";
import { ErrorModule } from "@server/modules/error/error.module";
/* Local Dependencies */
import { MintInfoService } from "./mintinfo.service";
import { MintInfoResolver } from "./mintinfo.resolver";

@Module({
  imports: [
    CashuMintApiModule,
    ErrorModule,
  ],
  providers: [
    MintInfoResolver,
    MintInfoService,
  ]
})
export class MintInfoModule {}
