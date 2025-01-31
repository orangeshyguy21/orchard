/* Core Dependencies */
import { Injectable } from '@nestjs/common';
/* Internal Dependencies */
import { OrchardStatus } from './status.model';

@Injectable()
export class StatusService {

  getStatus() : OrchardStatus {
    return {
      title: 'Orchard Graphql Server',
      online: true,
    }
  }
}
