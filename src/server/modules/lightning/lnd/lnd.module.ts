/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Local Dependencies */
import {LndService} from './lnd.service';

@Module({
	providers: [LndService],
	exports: [LndService],
})
export class LndModule {}
