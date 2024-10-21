/* Core Dependencies */
import { Controller, Get } from '@nestjs/common';
/* Application Dependencies */
import { AppService } from './app.service';
/* Type Dependencies */
import { ServerStatus } from './app.types';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getStatus(): ServerStatus {
    return this.appService.getStatus();
  }
}
