/* Core Dependencies */
import {Module, Logger} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {GraphQLModule, registerEnumType} from '@nestjs/graphql';
import {ApolloDriver, ApolloDriverConfig} from '@nestjs/apollo';
/* Vendor Dependencies */
import {TypeOrmModule} from '@nestjs/typeorm';
import {DataSource, DataSourceOptions} from 'typeorm';
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
import {
	LightningAddressType,
	LightningRequestType,
	LightningChannelCloseType,
	LightningChannelOpenInitiator,
} from './modules/lightning/lightning.enums';
import {TaprootAssetType, TaprootAssetVersion} from './modules/tapass/tapass.enums';
import {MintAnalyticsInterval, MintActivityPeriod} from './modules/cashu/mintdb/cashumintdb.enums';
import {LightningAnalyticsInterval, LightningAnalyticsMetric} from './modules/lightning/analytics/lnanalytics.enums';
import {MintUnit, MintQuoteState, MeltQuoteState, MintProofState} from './modules/cashu/cashu.enums';
import {AiAgent, AiMessageRole, AiFunctionName} from './modules/ai/ai.enums';
import {UserRole} from './modules/user/user.enums';
import {SettingKey, SettingValue} from './modules/setting/setting.enums';
import {UTXOracleProgressStatus} from './modules/bitcoin/utxoracle/utxoracle.enums';
import {
	EventLogActorType,
	EventLogSection,
	EventLogEntityType,
	EventLogType,
	EventLogStatus,
	EventLogDetailStatus,
} from './modules/event/event.enums';
/* Application Configuration */
import {config} from './config/configuration';

function initializeGraphQL(configService: ConfigService): ApolloDriverConfig {
	registerEnumType(MintUnit, {name: 'MintUnit'});
	registerEnumType(MintQuoteState, {name: 'MintQuoteState'});
	registerEnumType(MeltQuoteState, {name: 'MeltQuoteState'});
	registerEnumType(MintProofState, {name: 'MintProofState'});
	registerEnumType(MintAnalyticsInterval, {name: 'MintAnalyticsInterval'});
	registerEnumType(MintActivityPeriod, {name: 'MintActivityPeriod'});
	registerEnumType(TaprootAssetType, {name: 'TaprootAssetType'});
	registerEnumType(TaprootAssetVersion, {name: 'TaprootAssetVersion'});
	registerEnumType(LightningAddressType, {name: 'LightningAddressType'});
	registerEnumType(LightningRequestType, {name: 'LightningRequestType'});
	registerEnumType(LightningChannelCloseType, {name: 'LightningChannelCloseType'});
	registerEnumType(LightningChannelOpenInitiator, {name: 'LightningChannelOpenInitiator'});
	registerEnumType(LightningAnalyticsInterval, {name: 'LightningAnalyticsInterval'});
	registerEnumType(LightningAnalyticsMetric, {name: 'LightningAnalyticsMetric'});
	registerEnumType(AiAgent, {name: 'AiAgent'});
	registerEnumType(AiMessageRole, {name: 'AiMessageRole'});
	registerEnumType(AiFunctionName, {name: 'AiFunctionName'});
	registerEnumType(UserRole, {name: 'UserRole'});
	registerEnumType(SettingKey, {name: 'SettingKey'});
	registerEnumType(SettingValue, {name: 'SettingValue'});
	registerEnumType(UTXOracleProgressStatus, {name: 'UTXOracleProgressStatus'});
	registerEnumType(EventLogActorType, {name: 'EventLogActorType'});
	registerEnumType(EventLogSection, {name: 'EventLogSection'});
	registerEnumType(EventLogEntityType, {name: 'EventLogEntityType'});
	registerEnumType(EventLogType, {name: 'EventLogType'});
	registerEnumType(EventLogStatus, {name: 'EventLogStatus'});
	registerEnumType(EventLogDetailStatus, {name: 'EventLogDetailStatus'});

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
				database: process.env.SCHEMA_ONLY ? ':memory:' : configService.get('database.path'),
				entities: [],
				synchronize: process.env.SCHEMA_ONLY ? true : configService.get('database.synchronize'),
				autoLoadEntities: true,
				migrations: process.env.SCHEMA_ONLY ? [] : ['dist/database/migrations/*.js'],
				migrationsRun: process.env.SCHEMA_ONLY ? false : configService.get('mode.production'),
			}),
			dataSourceFactory: async (options: DataSourceOptions) => {
				const data_source = new DataSource(options);
				await data_source.initialize();
				if (options.synchronize && !options.migrationsRun) {
					await data_source.runMigrations({fake: true});
				}
				return data_source;
			},
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
