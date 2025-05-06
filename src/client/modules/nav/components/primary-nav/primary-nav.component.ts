/* Core Dependencies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
/* Vendor Dependencies */
import { Subscription, timer, EMPTY } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
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

	@Input() active_section!: string;

	public active_event!: EventData | null;
	public block_count!: number;

	private subscriptions: Subscription = new Subscription();

	constructor(
		private changeDetectorRef: ChangeDetectorRef,
		private eventService: EventService,
		private bitcoinService: BitcoinService,
	) {}

	ngOnInit(): void {
		const event_subscription = this.getEventSubscription();
		const bitcoin_subscription = this.getBitcoinSubscription();
		this.subscriptions.add(event_subscription);
		this.subscriptions.add(bitcoin_subscription);
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
			next: async (block_count: BitcoinBlockCount) => {
				this.block_count = block_count.height;
				this.changeDetectorRef.detectChanges();
			}
		});
	}

	private manageEvent(event: EventData | null): void {
		this.active_event = event;
		this.changeDetectorRef.detectChanges();
	}	

	public onSave(): void {
		this.active_event!.confirmed = true;
		this.eventService.registerEvent(this.active_event);
	}
	
	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}
}
