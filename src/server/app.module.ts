/* Core Dependencies */
import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule, registerEnumType } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
/* Application Modules */
import { ApiModule } from './modules/api/api.module';
import { FetchModule } from './modules/fetch/fetch.module';
import { WebserverModule } from './modules/webserver/webserver.module';
/* Custom Graphql Type Definitions */
import { UnixTimestamp } from './modules/graphql/scalars/unixtimestamp.scalar';
import { Timezone } from './modules/graphql/scalars/timezone.scalar';
import { MintAnalyticsInterval } from './modules/cashu/mintdb/cashumintdb.enums';
import { MintUnit, MintQuoteState, MeltQuoteState, MintProofState } from './modules/cashu/cashu.enums';
import { AiAgent, AiMessageRole, AiFunctionName } from './modules/ai/ai.enums';
/* Application Configuration */
import { config } from './config/configuration';

function initializeGraphQL(configService: ConfigService): ApolloDriverConfig {
	registerEnumType( MintUnit, { name: 'MintUnit' });
	registerEnumType( MintQuoteState, { name: 'MintQuoteState' });
	registerEnumType( MeltQuoteState, { name: 'MeltQuoteState' });
	registerEnumType( MintProofState, { name: 'MintProofState' });
	registerEnumType( MintAnalyticsInterval, { name: 'MintAnalyticsInterval' });
	registerEnumType( AiAgent, { name: 'AiAgent' });
	registerEnumType( AiMessageRole, { name: 'AiMessageRole' });
	registerEnumType( AiFunctionName, { name: 'AiFunctionName' });
	
	const path = configService.get('server.path');
	
	return {
		autoSchemaFile: configService.get('mode.production') ? true : 'schema.gql',
		sortSchema: true,
		path: path,
		installSubscriptionHandlers: true,
		resolvers: { 
			UnixTimestamp: UnixTimestamp,
			Timezone: Timezone,
		},
	}
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
		ApiModule,
		FetchModule,
		// SseModule,
		WebserverModule,
	],
	providers: [Logger],
})
export class AppModule {}