/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Local Dependencies */
import {ClnService} from './cln.service';

@Module({
	providers: [ClnService],
	exports: [ClnService],
})
export class ClnModule {}
