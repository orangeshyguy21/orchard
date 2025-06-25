/* Core Dependencies */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
/* Application Dependencies */
import { UserModule } from '@server/modules/user/user.module';
/* Local Dependencies */
import { AuthService } from './auth.service';

@Module({
    imports: [
        UserModule,
        JwtModule.registerAsync({
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: { expiresIn: '1h' },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [
        AuthService
    ],
    exports: [
        AuthService
    ],
})
export class AuthModule {}