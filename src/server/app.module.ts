/* Core Dependencies */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
/* Application Dependencies */
import { WebserverModule } from './modules/webserver/webserver.module';
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
    WebserverModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
