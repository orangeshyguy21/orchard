/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
/* Application Dependencies */
import {ChangeService} from '@server/modules/change/change.service';
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
import {ChangeEventFilters} from '@server/modules/change/change.interfaces';
/* Local Dependencies */
import {OrchardChangeEvent} from './change.model';

@Injectable()
export class ApiChangeService {
    private readonly logger = new Logger(ApiChangeService.name);

    constructor(
        private changeService: ChangeService,
        private errorService: ErrorService,
    ) {}

    /**
     * Get change events with optional filters
     * @param {string} tag - Logging tag
     * @param {ChangeEventFilters} filters - Optional filters
     * @returns {Promise<OrchardChangeEvent[]>} The change events
     */
    async getChangeEvents(tag: string, filters: ChangeEventFilters = {}): Promise<OrchardChangeEvent[]> {
        try {
            const events = await this.changeService.getChangeEvents(filters);
            return events.map((event) => new OrchardChangeEvent(event));
        } catch (error) {
            const orchard_error = this.errorService.resolveError(this.logger, error, tag, {
                errord: OrchardErrorCode.ChangeError,
            });
            throw new OrchardApiError(orchard_error);
        }
    }
}
