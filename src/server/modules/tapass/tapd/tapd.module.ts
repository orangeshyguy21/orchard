/* Core Dependencies */
import { Module } from '@nestjs/common';
/* Local Dependencies */
import { TapdService } from './tapd.service';

@Module({
	providers: [TapdService],
	exports: [TapdService],
})
export class TapdModule {}
