/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Local Dependencies */
import {TelegramModule} from './telegram/telegram.module';
import {MessageService} from './message.service';

@Module({
	imports: [TelegramModule],
	providers: [MessageService],
	exports: [MessageService],
})
export class MessageModule {}
