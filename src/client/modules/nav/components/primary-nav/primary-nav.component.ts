/* Core Dependencies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Router, Event, ActivatedRoute } from '@angular/router';
/* Vendor Dependencies */
import { Subscription, timer, EMPTY } from 'rxjs';
import { filter, switchMap, catchError } from 'rxjs/operators';
/* Application Dependencies */
import { EventService } from 'src/client/modules/event/services/event/event.service';
import { EventData } from 'src/client/modules/event/classes/event-data.class';
import { BitcoinService } from '@client/modules/bitcoin/services/bitcoin.service';
import { BitcoinBlockCount } from '@client/modules/bitcoin/classes/bitcoin-blockcount.class';

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
	public block_count!: number;

	private subscriptions: Subscription;

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private changeDetectorRef: ChangeDetectorRef,
		private eventService: EventService,
		private bitcoinService: BitcoinService,
	) {
		this.subscriptions = new Subscription();
	}

	ngOnInit(): void {
		const router_subscription = this.getRouterSubscription();
		const event_subscription = this.getEventSubscription();
		const bitcoin_subscription = this.getBitcoinSubscription();
		this.subscriptions.add(router_subscription);
		this.subscriptions.add(event_subscription);
		this.subscriptions.add(bitcoin_subscription);
	}

	private getRouterSubscription(): Subscription {
		return this.router.events
			.pipe(
				filter((event: Event) => 'routerEvent' in event || 'type' in event)
			)
			.subscribe(event => {
				this.setSection(event);
			});
	}

	private getEventSubscription(): Subscription {
		return this.eventService.getActiveEvent()
			.subscribe((event_data: EventData | null) => {
				this.manageEvent(event_data);
			});
	}

	private getBitcoinSubscription(): Subscription {
		return timer(0, 60000).pipe(
			switchMap(() => this.bitcoinService.getBlockCount().pipe(
				catchError(error => {
					console.error('Failed to fetch block count, polling stopped:', error);
					return EMPTY;
				})
			))
		).subscribe({
			next: (block_count: BitcoinBlockCount) => {
				this.block_count = block_count.height;
				this.changeDetectorRef.detectChanges();
			}
		});
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
