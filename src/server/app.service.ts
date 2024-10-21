/* Core Dependencies */
import { Injectable } from '@nestjs/common';
/* Type Dependencies */
import { ServerStatus } from './app.types';

@Injectable()
export class AppService {
  getStatus(): ServerStatus {
    return {
      message: 'Orchard Server Online...',
    }
  }
}
