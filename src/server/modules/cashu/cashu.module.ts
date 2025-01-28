/* Core Dependencies */
import { Module } from '@nestjs/common';
/* Application Dependencies */
import { CashuService } from './cashu.service';

@Module({
    providers: [CashuService],
    exports: [CashuService],
})
export class CashuModule {}
