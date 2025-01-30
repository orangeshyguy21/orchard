/* Core Dependencies */
import { Module } from '@nestjs/common';
/* Application Dependencies */
import { FetchModule } from '../fetch/fetch.module';
import { CashuService } from './cashu.service';

@Module({
    imports: [FetchModule],
    providers: [CashuService],
    exports: [CashuService],
})
export class CashuModule {}
