/* Core Dependencies */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule, registerEnumType } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
/* Vendor Dependencies */
import { WinstonModule } from 'nest-winston';
import { transports, format } from 'winston';
/* Application Modules */
import { ApiModule } from './modules/api/api.module';
import { FetchModule } from './modules/fetch/fetch.module';
import { WebserverModule } from './modules/webserver/webserver.module';
/* Custom Graphql Type Definitions */
import { UnixTimestamp } from './modules/graphql/scalars/unixtimestamp.scalar';
import { MintUnit, MintQuoteStatus, MeltQuoteStatus } from './modules/cashumintdb/cashumintdb.enums';
/* Application Configuration */
import { config } from './config/configuration';

const { combine, timestamp, prettyPrint } = format;

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
      useFactory: (
        configService: ConfigService,
      ) => ({
        autoSchemaFile: configService.get('mode.production') ? true : 'schema.gql',
        sortSchema: true,
        path: configService.get('server.path'),
        resolvers: { 
          UnixTimestamp: UnixTimestamp
        },
      }),
    }),
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        level: configService.get('server.log'),
        transports: [new transports.Console({
          format: format.combine(
            format.timestamp({
              format: 'MM/DD/YYYY, h:mm:ss A',
            }),
            format.printf((info) => {
              const pid = process.pid;
              return `[Orch] ${pid}  - ${info.timestamp}     ${info.level.toUpperCase()} [${info.context || 'Application'}] ${info.message}`;
            }),
          ),
        })],
      }),
    }),
    ApiModule,
    FetchModule,
    WebserverModule,
  ],
})
export class AppModule {}

registerEnumType( MintUnit, {
  name: 'MintUnit',
});
registerEnumType( MintQuoteStatus, {
  name: 'MintQuoteStatus',
});
registerEnumType( MeltQuoteStatus, {
  name: 'MeltQuoteStatus',
});