/* Core Dependencies */
import { Module } from '@nestjs/common';
/* Application Dependencies */
import { FetchModule } from '../fetch/fetch.module';
/* Internal Dependencies */
import { CashuMintApiService } from './cashumintapi.service';

@Module({
  imports: [FetchModule],
  providers: [CashuMintApiService],
  exports: [CashuMintApiService],
})
export class CashuMintApiModule {}
