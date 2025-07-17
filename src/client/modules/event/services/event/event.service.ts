/* Core Dependencies */
import { Injectable } from '@angular/core';
/* Vendor Dependencies */
import { Subject, Observable } from 'rxjs';
/* Native Dependencies */
import { EventData } from 'src/client/modules/event/classes/event-data.class';

@Injectable({
  	providedIn: 'root'
})
export class EventService {

	private event_history: EventData[] = [];
	private active_event_subject = new Subject<EventData | null>();
	private active_event!: EventData;
	private saving_time!: number;

	public registerEvent(event_data: EventData | null): void {
		if( !event_data ) return this.active_event_subject.next(null);
		if( event_data.type === 'SAVING') this.saving_time = Date.now();
		if( this.active_event?.type === 'SAVING' && event_data.type === 'SUCCESS' ) {
			const time_remaining = 1000 + this.saving_time - Date.now();
			const delay = time_remaining > 0 ? time_remaining : 0;
			setTimeout(() => this.emitEvent(event_data), delay);
			return;
		}
		this.emitEvent(event_data);
	}

	private emitEvent(event_data: EventData): void {
		this.active_event = event_data;
		event_data.created_at = Math.floor(Date.now() / 1000);
		this.event_history.push(new EventData(event_data));
		this.active_event_subject.next(event_data);
		if( event_data.duration ) this.clearEvent(event_data);
	}

	public getEventHistory(): EventData[] {
		return [...this.event_history];
	}

	public getActiveEvent(): Observable<EventData | null> {
		return this.active_event_subject.asObservable();
	}

	private clearEvent(event_data: EventData): void {
		setTimeout(() => {
			if( this.active_event.type === 'PENDING' ) return;
			if( this.active_event.id !== event_data.id ) return;
			this.active_event_subject.next(null);
		}, event_data?.duration || 5000);
	}
}