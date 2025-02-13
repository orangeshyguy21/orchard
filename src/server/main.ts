/* Core Dependencies */
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
/* Vendor Dependencies */
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
/* Application */
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get<Logger>(WINSTON_MODULE_PROVIDER);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('server.port');
  const path = configService.get<string>('server.path');
  app.setGlobalPrefix(path);
  await app.listen(port);
  logger.info(`Application is running on: http://localhost:${port}/${path}`);
}

bootstrap();
