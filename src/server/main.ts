/* Core Dependencies */
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
/* Application Dependencies */
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('server.port');
  console.log('port ',port)
  await app.listen(port ?? 3321);
}

bootstrap();
