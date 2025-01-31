/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Application Dependencies */
import { CashuMintApiModule } from "../../cashumintapi/cashumintapi.module";
/* Internal Dependencies */
import { MintInfoService } from "./mintinfo.service";
import { MintInfoResolver } from "./mintinfo.resolver";

@Module({
  imports: [
    CashuMintApiModule,
  ],
  providers: [
    MintInfoResolver,
    MintInfoService,
  ]
})
export class MintInfoModule {}
