/* Core Dependencies */
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ConsoleLogger, LogLevel, INestApplication } from '@nestjs/common';
/* Vendor Dependencies */
import * as express from 'express';
/* Application */
import { AppModule } from './app.module';
import { LightningType } from './modules/lightning/lightning.enums';
import { MintType } from './modules/cashu/cashu.enums';


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
	app.use(express.json({ limit: '10mb' }));
	app.use(express.urlencoded({ limit: '10mb', extended: true }));
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
	// validate LIGHTNING_TYPE
	const lightning_type = configService.get<LightningType>('lightning.type');
	if( !lightning_type ) shutdown(app, logger, 'LIGHTNING_TYPE not configured');
	if( !Object.values(LightningType).includes(lightning_type) ) shutdown(app, logger, `Invalid LIGHTNING_TYPE: ${lightning_type}`);
	// validate MINT_TYPE
	const mint_type = configService.get<MintType>('cashu.type');
	if( !mint_type ) shutdown(app, logger, 'MINT_TYPE not configured');
	if( !Object.values(MintType).includes(mint_type) ) shutdown(app, logger, `Invalid MINT_TYPE: ${mint_type}`);
	// validate MINT_DATABASE
	const mint_database = configService.get<string>('cashu.database');
	if( !mint_database ) shutdown(app, logger, 'MINT_DATABASE not configured');
}

function shutdown(app: INestApplication, logger: Logger, error: string) : void {
	logger.error(error);
	app.close();
}

bootstrap();