/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Application Dependencies */
import {MessageModule} from '@server/modules/message/message.module';
/* Local Dependencies */
import {ToolService} from './tool.service';

@Module({
	imports: [MessageModule],
	providers: [ToolService],
	exports: [ToolService],
})
export class ToolModule {}
