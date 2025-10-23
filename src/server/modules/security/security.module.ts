/* Core Dependencies */
import {Module} from '@nestjs/common';
import {APP_GUARD} from '@nestjs/core';
import {ConfigService} from '@nestjs/config';
import {ThrottlerModule} from '@nestjs/throttler';
/* Application Dependencies */
import {GqlAuthenticationGuard} from '@server/modules/auth/guards/authentication.guard';
import {GqlAuthorizationGuard} from '@server/modules/auth/guards/authorization.guard';
/* Local Dependencies */
import {GqlThrottlerGuard} from './guards/throttler.guard';

@Module({
	imports: [
		ThrottlerModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService) => [
				{
					ttl: config.get('server.ttl'),
					limit: config.get('server.limit'),
				},
			],
		}),
	],
	providers: [
		{provide: APP_GUARD, useClass: GqlAuthenticationGuard},
		{provide: APP_GUARD, useClass: GqlAuthorizationGuard},
		{provide: APP_GUARD, useClass: GqlThrottlerGuard},
	],
})
export class SecurityModule {}
