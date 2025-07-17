/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Local Dependencies */
import {ErrorService} from './error.service';

@Module({
	providers: [ErrorService],
	exports: [ErrorService],
})
export class ErrorModule {}
