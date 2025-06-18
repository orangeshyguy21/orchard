/* Core Dependencies */
import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router, Event, ActivatedRoute } from '@angular/router';
/* Native Dependencies */
import { BitcoinService } from '@client/modules/bitcoin/services/bitcoin/bitcoin.service';
import { BitcoinNetworkInfo } from '@client/modules/bitcoin/classes/bitcoin-network-info.class';
import { BitcoinBlockchainInfo } from '@client/modules/bitcoin/classes/bitcoin-blockchain-info.class';
/* Vendor Dependencies */
import { filter, Subscription } from 'rxjs';

@Component({
	selector: 'orc-bitcoin-section',
	standalone: false,
	templateUrl: './bitcoin-section.component.html',
	styleUrl: './bitcoin-section.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class BitcoinSectionComponent implements OnInit, OnDestroy {

	public bitcoin_blockchain_info: BitcoinBlockchainInfo | null = null;
	public bitcoin_network_info: BitcoinNetworkInfo | null = null;
	public active_sub_section:string = '';
	public loading:boolean = true;
	public error:boolean = false;

	private subscriptions: Subscription = new Subscription();

	constructor(
		private bitcoinService: BitcoinService,
		private router: Router,
		private route: ActivatedRoute,
		private cdr: ChangeDetectorRef,
	) {}

	ngOnInit(): void {
		this.bitcoinService.loadBitcoinNetworkInfo().subscribe({
			next: (info: BitcoinNetworkInfo) => {
				this.bitcoin_network_info = info;
				this.cdr.detectChanges();
			},
			error: (error) => {
				this.error = true;
				this.loading = false;
				this.cdr.detectChanges();
			}
		});
		this.bitcoinService.loadBitcoinBlockchainInfo().subscribe();
		this.subscriptions.add(this.getBitcoinBlockchainInfoSubscription());
		this.subscriptions.add(this.getRouterSubscription());
	}

	private getBitcoinBlockchainInfoSubscription(): Subscription {
		return this.bitcoinService.bitcoin_blockchain_info$.subscribe(
			(info:BitcoinBlockchainInfo | null) => {
				if( info ) this.bitcoin_blockchain_info = info;
				this.cdr.detectChanges();
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
		this.cdr.detectChanges();
	}

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}
}
