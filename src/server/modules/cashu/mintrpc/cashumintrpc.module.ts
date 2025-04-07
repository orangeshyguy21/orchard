/* Core Dependencies */
import { Module } from '@nestjs/common';
/* Application Dependencies */
import { FetchModule } from '@server/modules/fetch/fetch.module';
import { CdkModule } from '@server/modules/cashu/cdk/cdk.module';
/* Local Dependencies */
import { CashuMintRpcService } from './cashumintrpc.service';

@Module({
  imports: [
    FetchModule,
    CdkModule,
  ],
  providers: [
    CashuMintRpcService,
  ],
  exports: [
    CashuMintRpcService,
  ],
})
export class CashuMintRpcModule {}
