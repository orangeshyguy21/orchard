/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Local Dependencies */
import {UserService} from './user.service';

@Module({
	providers: [UserService],
	exports: [UserService],
})
export class UserModule {}
