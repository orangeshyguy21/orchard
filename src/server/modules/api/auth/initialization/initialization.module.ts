/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Application Dependencies */
import {ErrorModule} from '@server/modules/error/error.module';
import {AuthModule} from '@server/modules/auth/auth.module';
import {UserModule} from '@server/modules/user/user.module';
/* Internal Dependencies */
import {AtuhInitializationResolver} from './initialization.resolver';
import {AtuhInitializationService} from './initialization.service';

@Module({
	imports: [ErrorModule, AuthModule, UserModule],
	providers: [AtuhInitializationResolver, AtuhInitializationService],
})
export class AuthInitializationModule {}
