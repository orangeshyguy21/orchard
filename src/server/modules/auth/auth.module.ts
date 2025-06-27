/* Core Dependencies */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
/* Application Dependencies */
import { UserModule } from '@server/modules/user/user.module';
/* Local Dependencies */
import { AuthService } from './auth.service';
import { AuthStrategy } from './strategy/auth.strategy';
import { RefreshTokenStrategy } from './strategy/refresh.strategy';

@Module({
    imports: [
        PassportModule,
        UserModule,
        JwtModule.registerAsync({
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('server.pass'),
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [
        AuthService,
        AuthStrategy,
        RefreshTokenStrategy,
    ],
    exports: [
        AuthService
    ],
})
export class AuthModule {}