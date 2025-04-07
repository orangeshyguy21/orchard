/* Core Dependencies */
import { Module } from '@nestjs/common';
/* Application Dependencies */
import { FetchModule } from '@server/modules/fetch/fetch.module';
/* Local Dependencies */
import { CashuMintRpcService } from './cashumintrpc.service';

@Module({
  imports: [FetchModule],
  providers: [CashuMintRpcService],
  exports: [CashuMintRpcService],
})
export class CashuMintRpcModule {}
