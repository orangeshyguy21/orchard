/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
/* Application Dependencies */
import {EventLogService} from '@server/modules/event/event.service';
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
import {EventLogFilters} from '@server/modules/event/event.interfaces';
/* Local Dependencies */
import {OrchardEventLog} from './event.model';

@Injectable()
export class ApiEventLogService {
    private readonly logger = new Logger(ApiEventLogService.name);

    constructor(
        private eventLogService: EventLogService,
        private errorService: ErrorService,
    ) {}

    /**
     * Get event logs with optional filters
     * @param {string} tag - Logging tag
     * @param {EventLogFilters} filters - Optional filters
     * @returns {Promise<OrchardEventLog[]>} The event logs
     */
    async getEventLogs(tag: string, filters: EventLogFilters = {}): Promise<OrchardEventLog[]> {
        try {
            const events = await this.eventLogService.getEvents(filters);
            return events.map((event) => new OrchardEventLog(event));
        } catch (error) {
            const orchard_error = this.errorService.resolveError(this.logger, error, tag, {
                errord: OrchardErrorCode.EventLogError,
            });
            throw new OrchardApiError(orchard_error);
        }
    }
}
