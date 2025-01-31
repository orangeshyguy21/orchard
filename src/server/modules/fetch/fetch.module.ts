/* Core Dependencies */
import { Module } from '@nestjs/common';
/* Internal Dependencies */
import { FetchService } from './fetch.service';

@Module({
  providers: [FetchService],
  exports: [FetchService],
})
export class FetchModule {}