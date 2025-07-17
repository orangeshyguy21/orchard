/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Local Dependencies */
import {FetchService} from './fetch.service';

@Module({
	providers: [FetchService],
	exports: [FetchService],
})
export class FetchModule {}
