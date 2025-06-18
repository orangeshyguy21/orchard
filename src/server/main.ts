/* Core Dependencies */
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ConsoleLogger, LogLevel, INestApplication } from '@nestjs/common';
/* Vendor Dependencies */
import * as express from 'express';
/* Application */
import { AppModule } from './app.module';
import { BitcoinType } from './modules/bitcoin/bitcoin.enums';
import { LightningType } from './modules/lightning/lightning.enums';
import { TaprootAssetType } from './modules/tapass/tapass.enums';
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
	// validate BITCOIN_TYPE
	const bitcoin_type = configService.get<BitcoinType>('bitcoin.type');
	if( bitcoin_type && !Object.values(BitcoinType).includes(bitcoin_type) ) shutdown(app, logger, `Invalid BITCOIN_TYPE: ${bitcoin_type}`);
	// validate LIGHTNING_TYPE
	const lightning_type = configService.get<LightningType>('lightning.type');
	if( lightning_type && !Object.values(LightningType).includes(lightning_type) ) shutdown(app, logger, `Invalid LIGHTNING_TYPE: ${lightning_type}`);
	// validate TAPROOT_ASSET_TYPE
	const taproot_asset_type = configService.get<TaprootAssetType>('taproot_assets.type');
	if( taproot_asset_type && !Object.values(TaprootAssetType).includes(taproot_asset_type) ) shutdown(app, logger, `Invalid TAPROOT_ASSET_TYPE: ${taproot_asset_type}`);
	// validate MINT_TYPE
	const mint_type = configService.get<MintType>('cashu.type');
	if( mint_type && !Object.values(MintType).includes(mint_type) ) shutdown(app, logger, `Invalid MINT_TYPE: ${mint_type}`);
	// validate MINT_DATABASE
	const mint_database = configService.get<string>('cashu.database');
	if( mint_type && !mint_database ) shutdown(app, logger, 'MINT_DATABASE not configured');
}

function shutdown(app: INestApplication, logger: Logger, error: string) : void {
	logger.error(error);
	app.close();
}

bootstrap();