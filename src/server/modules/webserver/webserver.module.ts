import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: 'dist/client',
      exclude: ['/api/(.*)'],
    }),
  ]
})
export class WebserverModule {}