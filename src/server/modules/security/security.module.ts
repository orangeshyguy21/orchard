/* Core Dependencies */
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

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

    providers: [],
})
export class SecurityModule {}
