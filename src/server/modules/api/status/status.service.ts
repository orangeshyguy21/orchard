/* Core Dependencies */
import { Injectable } from '@nestjs/common';
/* Application Dependencies */
import { Status } from './status.model';

@Injectable()
export class StatusService {

  getStatus() : Status {
    return {
      title: 'Orchard Graphql Server',
      online: true,
    }
  }
  
}
