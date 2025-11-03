/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Application Dependencies */
import {AuthModule} from '@server/modules/auth/auth.module';
/* Local Dependencies */
import {TaskService} from './task.service';

@Module({
	imports: [AuthModule], // Import AuthModule to access AuthService
	providers: [TaskService],
})
export class TaskModule {}
