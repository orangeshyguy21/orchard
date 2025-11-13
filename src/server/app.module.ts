/* Core Dependencies */
import {Module, Logger} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {GraphQLModule, registerEnumType} from '@nestjs/graphql';
import {ApolloDriver, ApolloDriverConfig} from '@nestjs/apollo';
/* Vendor Dependencies */
import {TypeOrmModule} from '@nestjs/typeorm';
import {ScheduleModule} from '@nestjs/schedule';
/* Application Modules */
import {SecurityModule} from './modules/security/security.module';
import {AuthModule} from './modules/auth/auth.module';
import {ApiModule} from './modules/api/api.module';
import {FetchModule} from './modules/fetch/fetch.module';
import {WebserverModule} from './modules/webserver/webserver.module';
import {TaskModule} from './modules/task/task.module';
/* Custom Graphql Type Definitions */
import {UnixTimestamp} from './modules/graphql/scalars/unixtimestamp.scalar';
import {Timezone} from './modules/graphql/scalars/timezone.scalar';
import {Base64} from './modules/graphql/scalars/base64.scalar';
import {LightningAddressType, LightningRequestType} from './modules/lightning/lightning.enums';
import {TaprootAssetType, TaprootAssetVersion} from './modules/tapass/tapass.enums';
import {MintAnalyticsInterval} from './modules/cashu/mintdb/cashumintdb.enums';
import {MintUnit, MintQuoteState, MeltQuoteState, MintProofState, MintPaymentMethod} from './modules/cashu/cashu.enums';
import {AiAgent, AiMessageRole, AiFunctionName} from './modules/ai/ai.enums';
import {UserRole} from './modules/user/user.enums';
import {SettingValue} from './modules/setting/setting.enums';
/* Application Configuration */
import {config} from './config/configuration';

function initializeGraphQL(configService: ConfigService): ApolloDriverConfig {
	registerEnumType(MintUnit, {name: 'MintUnit'});
	registerEnumType(MintQuoteState, {name: 'MintQuoteState'});
	registerEnumType(MeltQuoteState, {name: 'MeltQuoteState'});
	registerEnumType(MintProofState, {name: 'MintProofState'});
	registerEnumType(MintPaymentMethod, {name: 'MintPaymentMethod'});
	registerEnumType(MintAnalyticsInterval, {name: 'MintAnalyticsInterval'});
	registerEnumType(TaprootAssetType, {name: 'TaprootAssetType'});
	registerEnumType(TaprootAssetVersion, {name: 'TaprootAssetVersion'});
	registerEnumType(LightningAddressType, {name: 'LightningAddressType'});
	registerEnumType(LightningRequestType, {name: 'LightningRequestType'});
	registerEnumType(AiAgent, {name: 'AiAgent'});
	registerEnumType(AiMessageRole, {name: 'AiMessageRole'});
	registerEnumType(AiFunctionName, {name: 'AiFunctionName'});
	registerEnumType(UserRole, {name: 'UserRole'});
	registerEnumType(SettingValue, {name: 'SettingValue'});

	const path = configService.get('server.path');
	const is_production = configService.get('mode.production');

	return {
		autoSchemaFile: is_production ? true : 'schema.gql',
		sortSchema: true,
		path: path,
		subscriptions: {
			'graphql-ws': true,
			'subscriptions-transport-ws': false,
		},
		playground: !is_production,
		resolvers: {
			UnixTimestamp: UnixTimestamp,
			Timezone: Timezone,
			Base64: Base64,
		},
		formatError: (error) => {
			if (!configService.get('mode.production')) return error;
			return {
				message: error.message,
				extensions: {
					code: error.extensions?.code,
				},
			};
		},
	};
}

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [config],
			envFilePath: ['.env'],
		}),
		GraphQLModule.forRootAsync<ApolloDriverConfig>({
			driver: ApolloDriver,
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => initializeGraphQL(configService),
		}),
		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				type: 'better-sqlite3',
				database: configService.get('database.path'),
				entities: [],
				synchronize: configService.get('database.synchronize'),
				autoLoadEntities: true,
				migrations: ['dist/database/migrations/*.js'],
				migrationsRun: configService.get('mode.production'),
			}),
		}),
		ScheduleModule.forRoot(),
		SecurityModule,
		AuthModule,
		ApiModule,
		FetchModule,
		WebserverModule,
		TaskModule,
	],
	providers: [Logger],
})
export class AppModule {}
