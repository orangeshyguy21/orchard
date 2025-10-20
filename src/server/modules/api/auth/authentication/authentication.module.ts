/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Application Dependencies */
import {ErrorModule} from '@server/modules/error/error.module';
import {AuthModule} from '@server/modules/auth/auth.module';
import {UserModule} from '@server/modules/user/user.module';
/* Internal Dependencies */
import {AuthenticationResolver} from './authentication.resolver';
import {AuthenticationService} from './authentication.service';

@Module({
	imports: [ErrorModule, AuthModule, UserModule],
	providers: [AuthenticationResolver, AuthenticationService],
})
export class AuthenticationModule {}
