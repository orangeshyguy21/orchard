/* Core Dependencies */
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ConsoleLogger, LogLevel, INestApplication } from '@nestjs/common';
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
	validation(app, configService, logger);
	logger.log(`Application is running on: ${host}:${port}/${path}`);
}

function validation(app: INestApplication, configService: ConfigService, logger: Logger) : void {
	// validate MINT_BACKEND
	const mint_backend = configService.get<string>('cashu.backend');
	if( !mint_backend ) shutdown(app, logger, 'MINT_BACKEND not configured');
	const valid_backends = ['nutshell', 'cdk'];
	if( !valid_backends.includes(mint_backend) ) shutdown(app, logger, `Invalid MINT_BACKEND: ${mint_backend}`);
	// validate MINT_DATABASE
	const mint_database = configService.get<string>('cashu.database');
	if( !mint_database ) shutdown(app, logger, 'MINT_DATABASE not configured');
}

function shutdown(app: INestApplication, logger: Logger, error: string) : void {
	logger.error(error);
	app.close();
}


bootstrap();
