/* Core Dependencies */
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
/* Application Dependencies */
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('server.port');
  const path = configService.get<string>('server.path');
  app.setGlobalPrefix(path);
  await app.listen(port);
}

bootstrap();
