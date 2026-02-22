/* Core Dependencies */
import {Injectable} from '@angular/core';
/* Vendor Dependencies */
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
/* Application Dependencies */
import {ApiService} from '@client/modules/api/services/api/api.service';
import {OrchardRes} from '@client/modules/api/types/api.types';
import {OrchardErrors} from '@client/modules/error/classes/error.class';
import {getApiQuery} from '@client/modules/api/helpers/api.helpers';
import {OrchardEventLog, QueryEvent_LogsArgs} from '@shared/generated.types';
/* Local Dependencies */
import {EventLog} from '../../classes/event-log.class';
import {EVENT_LOGS_QUERY} from './event-log.queries';

interface EventLogsResponse {
    event_logs: OrchardEventLog[];
}

@Injectable({
    providedIn: 'root',
})
export class EventLogService {
    constructor(
        private http: HttpClient,
        private apiService: ApiService,
    ) {}

    /**
     * Fetch event logs with optional filters.
     * @param {QueryEvent_LogsArgs} filters - Optional GraphQL filter args
     * @returns {Observable<EventLog[]>} The fetched event logs as client-side class instances
     */
    public getEventLogs(filters?: QueryEvent_LogsArgs): Observable<EventLog[]> {
        const query = getApiQuery(EVENT_LOGS_QUERY, filters);

        return this.http.post<OrchardRes<EventLogsResponse>>(this.apiService.api, query).pipe(
            map((response) => {
                if (response.errors) throw new OrchardErrors(response.errors);
                return response.data.event_logs;
            }),
            map((logs) => logs.map((log) => new EventLog(log))),
            catchError((error) => {
                console.error('Error loading event logs:', error);
                return throwError(() => error);
            }),
        );
    }
}
