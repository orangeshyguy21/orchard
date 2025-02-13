/* Core Dependencies */
import { Injectable } from '@nestjs/common';
/* Local Dependencies */
import { OrchardStatus } from './status.model';

@Injectable()
export class StatusService {

  getStatus() : OrchardStatus {
    return new OrchardStatus({
      title: 'Orchard Graphql Server',
      online: true,
    });
  }
}