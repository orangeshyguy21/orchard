/* Core Dependencies */
import { Injectable } from '@angular/core';
/* Vendor Dependencies */
import { Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
/* Native Dependencies */
import { EventData } from 'src/client/modules/event/classes/event-data.class';

@Injectable({
  	providedIn: 'root'
})
export class EventService {

	private event_subject = new Subject<EventData>();
	private event_history: EventData[] = [];
	private active_event_subject = new Subject<EventData | null>();

	emitEvent(event_data: EventData): void {
		event_data.created_at = Math.floor(Date.now() / 1000);
		this.event_history.push(new EventData(event_data));
		this.event_subject.next(event_data);
		this.active_event_subject.next(event_data);
		
		setTimeout(() => {
			this.active_event_subject.next(null);
		}, event_data.duration);
	}

	getEventHistory(): EventData[] {
		return [...this.event_history];
	}

	getEvents(): Observable<EventData> {
		return this.event_subject.asObservable();
	}

	getActiveEvent(): Observable<EventData | null> {
		return this.active_event_subject.asObservable();
	}

	getEventsByType(type: string): Observable<EventData> {
		return this.event_subject.asObservable().pipe(
			filter(event => event.type === type)
		);
	}
}