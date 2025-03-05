/* Core Dependencies */
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ConsoleLogger, LogLevel } from '@nestjs/common';
/* Application */
import { AppModule } from './app.module';

const log_levels: Record<string, LogLevel[]> = {
	'verbose': ['log', 'fatal', 'error', 'warn', 'debug', 'verbose'],
	'debug': ['log', 'fatal', 'error', 'warn', 'debug'],
	'info': ['log', 'fatal', 'error', 'warn'],
	'warn': ['fatal', 'error', 'warn'],
	'error': ['fatal', 'error'],
	'fatal': ['fatal'],
};

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);
	const loglevel = configService.get<string>('server.log') || 'info';
	app.useLogger(new ConsoleLogger('OrchardApplication', {
		logLevels: log_levels[loglevel],
		timestamp: (loglevel === 'verbose' || loglevel === 'debug') ? true : false,
	}));
	const port = configService.get<number>('server.port');
	const path = configService.get<string>('server.path');
	const host = configService.get<string>('server.host');
	app.setGlobalPrefix(path);
	await app.listen(port);
	const logger = new Logger('OrchardApplication');
	logger.log(`Application is running on: ${host}:${port}/${path}`);
}

bootstrap();
