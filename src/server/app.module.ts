/* Core Dependencies */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
/* Application Dependencies */
import { WebserverModule } from './modules/webserver/webserver.module';
import { ApiModule } from './modules/api/api.module';
/* Application Configuration */
import { config } from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      envFilePath: ['.env.local', '.env'],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService,
      ) => ({
        autoSchemaFile: configService.get('mode.production') ? true : 'schema.gql',
        sortSchema: true,
        path: configService.get('server.path'),
      }),
    }),
    ApiModule,
    WebserverModule,
  ],
})
export class AppModule {}
