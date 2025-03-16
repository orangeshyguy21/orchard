/* Core Dependencies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Router, Event, ActivatedRoute } from '@angular/router';
/* Vendor Dependencies */
import { Subscription } from 'rxjs';
import { filter} from 'rxjs/operators';
/* Application Dependencies */
import { EventService } from 'src/client/modules/event/services/event/event.service';
import { EventData } from 'src/client/modules/event/classes/event-data.class';


@Component({
	selector: 'orc-primary-nav',
	standalone: false,
	templateUrl: './primary-nav.component.html',
	styleUrl: './primary-nav.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrimaryNavComponent {

	public active_section! : string;
	public active_event!: EventData | null;


	private subscriptions: Subscription;

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private changeDetectorRef: ChangeDetectorRef,
		private eventService: EventService
	) {
		this.subscriptions = new Subscription();
	}

	ngOnInit(): void {
		// Subscribe to router events
		const router_subscription = this.router.events
			.pipe(
				filter((event: Event) => 'routerEvent' in event || 'type' in event)
			)
			.subscribe(event => {
				this.setSection(event);
			});
		
		// Subscribe to navigation events from the event service
		const event_subscription = this.eventService.getActiveEvent()
			.subscribe((event_data: EventData | null) => {
				this.manageEvent(event_data);
			});
		
		// Add both subscriptions to the main subscription
		this.subscriptions.add(router_subscription);
		this.subscriptions.add(event_subscription);

	}

	private setSection(event: Event): void {
		const router_event = 'routerEvent' in event ? event.routerEvent : event;
		if( router_event.type !== 1 ) return;
		let route = this.activatedRoute.root;
		while (route.firstChild) {
			route = route.firstChild;
		}
		if( !route.snapshot.data ) return;
		this.active_section = route.snapshot.data['section'] || '';
		this.changeDetectorRef.detectChanges();
	}

	private manageEvent(event: EventData | null): void {
		this.active_event = event;
		this.changeDetectorRef.detectChanges();
	}	
	
	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}
}
