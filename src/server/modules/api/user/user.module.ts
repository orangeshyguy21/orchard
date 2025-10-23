/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Application Dependencies */
import {ErrorModule} from '@server/modules/error/error.module';
import {UserModule} from '@server/modules/user/user.module';
/* Local Dependencies */
import {ApiUserService} from './user.service';
import {ApiUserResolver} from './user.resolver';

@Module({
	imports: [ErrorModule, UserModule],
	providers: [ApiUserResolver, ApiUserService],
})
export class ApiUserModule {}
