/* Core Dependencies */
import { Module } from '@nestjs/common';
/* Internal Dependencies */
import { CashuMintDatabaseService } from './cashumintdb.service';

@Module({
  providers: [CashuMintDatabaseService],
  exports: [CashuMintDatabaseService],
})
export class CashuMintDatabaseModule {}
