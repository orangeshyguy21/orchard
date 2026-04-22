/* Core Dependencies */
import {Module, Logger} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {GraphQLModule} from '@nestjs/graphql';
import {ApolloDriver, ApolloDriverConfig} from '@nestjs/apollo';
/* Vendor Dependencies */
import {TypeOrmModule} from '@nestjs/typeorm';
import {DataSource, DataSourceOptions} from 'typeorm';
import {ScheduleModule} from '@nestjs/schedule';
import {EventEmitterModule} from '@nestjs/event-emitter';
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
/* Application Configuration */
import {config} from './config/configuration';

function initializeGraphQL(configService: ConfigService): ApolloDriverConfig {
	const path = configService.get('server.path');
	const is_production = configService.get('mode.production');

	return {
		autoSchemaFile: is_production ? true : 'schema.gql',
		sortSchema: true,
		path: path,
		subscriptions: {
			'graphql-ws': true,
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
				database: configService.get('mode.schema_only') ? ':memory:' : configService.get('database.path'),
				entities: [],
				synchronize: configService.get('mode.schema_only') ? true : configService.get('database.synchronize'),
				autoLoadEntities: true,
				migrations: configService.get('mode.schema_only') ? [] : ['dist/database/migrations/*.js'],
				migrationsRun: configService.get('mode.schema_only') ? false : configService.get('mode.production'),
				retryAttempts: configService.get('mode.schema_only') ? 0 : 10,
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
		EventEmitterModule.forRoot(),
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
