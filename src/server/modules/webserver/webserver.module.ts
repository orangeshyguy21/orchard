/* Core Dependencies */
import {Module} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {ServeStaticModule} from '@nestjs/serve-static';

@Module({
	imports: [
		ServeStaticModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => [
				{
					rootPath: 'dist/client',
					exclude: [`/${configService.get('server.path')}`],
				},
			],
		}),
	],
})
export class WebserverModule {}
