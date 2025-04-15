/* Core Dependencies */
import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router, Event, ActivatedRoute } from '@angular/router';
/* Vendor Dependencies */
import { filter, Subscription } from 'rxjs';
/* Application Dependencies */
import { MintService } from '@client/modules/mint/services/mint/mint.service';
import { MintInfo } from '@client/modules/mint/classes/mint-info.class';



// private subscriptions: Subscription;

// constructor(
// 	private router: Router,
// 	private activatedRoute: ActivatedRoute,
// 	private changeDetectorRef: ChangeDetectorRef,
// 	private eventService: EventService,
// 	private bitcoinService: BitcoinService,
// ) {
// 	this.subscriptions = new Subscription();
// }

// ngOnInit(): void {
// 	const router_subscription = this.getRouterSubscription();
// 	const event_subscription = this.getEventSubscription();
// 	const bitcoin_subscription = this.getBitcoinSubscription();
// 	this.subscriptions.add(router_subscription);
// 	this.subscriptions.add(event_subscription);
// 	this.subscriptions.add(bitcoin_subscription);
// }


@Component({
	selector: 'orc-mint-section',
	standalone: false,
	templateUrl: './mint-section.component.html',
	styleUrl: './mint-section.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintSectionComponent implements OnInit, OnDestroy {

	public mint_info: MintInfo | null = null;
	public active_sub_section:string = '';
	public loading:boolean = true;
	public error:boolean = false;

	private subscriptions: Subscription = new Subscription();

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private changeDetectorRef: ChangeDetectorRef,
		private mintService: MintService
	) {}
  
	ngOnInit(): void {
		this.mintService.loadMintInfo().subscribe({
			error: (error) => {
				this.error = true;
				this.loading = false;
				this.changeDetectorRef.detectChanges();
			}
		});

		const mint_info_subscription = this.getMintInfoSubscription();
		const router_subscription = this.getRouterSubscription();

		this.subscriptions.add(mint_info_subscription);
		this.subscriptions.add(router_subscription);
	}

	private getMintInfoSubscription(): Subscription {
		return this.mintService.mint_info$.subscribe(
            (info:MintInfo | null) => {
				if( !info ) return;
				this.mint_info = info;
				this.loading = false;
				this.changeDetectorRef.detectChanges();
            }
        );
	}

	private getRouterSubscription(): Subscription {
		return this.router.events
			.pipe(
				filter((event: Event) => 'routerEvent' in event || 'type' in event)
			)
			.subscribe(event => {
				this.setSubSection(event);
			});
	}

	private setSubSection(event: Event): void {
		const router_event = 'routerEvent' in event ? event.routerEvent : event;
		if( router_event.type !== 1 ) return;
		let route = this.route.root;
		while (route.firstChild) {
			route = route.firstChild;
		}
		if( !route.snapshot.data ) return;
		this.active_sub_section = route.snapshot.data['sub_section'] || '';
		this.changeDetectorRef.detectChanges();
	}

	public onClickMintName(): void {
		this.router.navigate(['mint', 'info']);
	}

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}
}
