/* Core Dependencies */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
/* Application Dependencies */
import { AppController } from './app.controller';
import { AppService } from './app.service';
/* Application Configuration */
import { config } from './config/configuration';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [config],
            envFilePath: ['.env.local', '.env'],
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
