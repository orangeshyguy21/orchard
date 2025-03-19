/* Core Dependencies */
import { Module } from '@nestjs/common';
/* Local Dependencies */
import { CashuMintDatabaseService } from './cashumintdb.service';

@Module({
  providers: [CashuMintDatabaseService],
  exports: [CashuMintDatabaseService],
})
export class CashuMintDatabaseModule {}
