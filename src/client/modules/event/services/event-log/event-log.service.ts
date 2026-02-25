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
import {OrchardEventLog, OrchardCommonCount, OrchardCommonGenesis, QueryEvent_LogsArgs} from '@shared/generated.types';
/* Local Dependencies */
import {EventLog} from '../../classes/event-log.class';
import {EVENT_LOGS_DATA_QUERY, EVENT_LOG_GENESIS_QUERY} from './event-log.queries';

interface EventLogsDataResponse {
	event_logs: OrchardEventLog[];
	event_log_count: OrchardCommonCount;
}

interface EventLogGenesisResponse {
	event_log_genesis: OrchardCommonGenesis;
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
	 * Fetch event logs with count for pagination.
	 * @param {QueryEvent_LogsArgs} filters - Optional GraphQL filter args
	 * @returns {Observable<{event_logs: EventLog[]; count: number}>} The fetched event logs and total count
	 */
	public getEventLogsData(filters?: QueryEvent_LogsArgs): Observable<{event_logs: EventLog[]; count: number}> {
		const query = getApiQuery(EVENT_LOGS_DATA_QUERY, filters);

		return this.http.post<OrchardRes<EventLogsDataResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data;
			}),
			map((data) => ({
				event_logs: data.event_logs.map((log) => new EventLog(log)),
				count: data.event_log_count.count,
			})),
			catchError((error) => {
				console.error('Error loading event logs:', error);
				return throwError(() => error);
			}),
		);
	}

	/**
	 * Fetch the earliest event timestamp (genesis).
	 * @returns {Observable<number>} The earliest event timestamp, or 0 if no events exist
	 */
	public getGenesis(): Observable<number> {
		const query = getApiQuery(EVENT_LOG_GENESIS_QUERY);

		return this.http.post<OrchardRes<EventLogGenesisResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.event_log_genesis.timestamp;
			}),
			catchError((error) => {
				console.error('Error loading event log genesis:', error);
				return throwError(() => error);
			}),
		);
	}
}
