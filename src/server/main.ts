/* Core Dependencies */
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
/* Application Dependencies */
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const configService = app.get(ConfigService);
  const port = configService.get<number>('server.port');
  await app.listen(port ?? 3321);
}

bootstrap();
