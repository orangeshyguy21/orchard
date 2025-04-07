/* Core Dependencies */
import { Module } from '@nestjs/common';
/* Application Dependencies */
import { FetchModule } from '@server/modules/fetch/fetch.module';
/* Local Dependencies */
import { BitcoinService } from './bitcoin.service';

@Module({
	imports: [
        FetchModule,
    ],
	providers: [
        BitcoinService,
    ],
	exports: [
        BitcoinService,
    ],
})
export class BitcoinModule {}