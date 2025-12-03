/* Core Dependencies */
import {Component, ChangeDetectionStrategy, OnInit, OnDestroy, signal, WritableSignal} from '@angular/core';
import {Router, Event, ActivatedRoute, NavigationStart} from '@angular/router';
/* Vendor Dependencies */
import {filter, Subscription} from 'rxjs';
/* Application Dependencies */
import {SettingAppService} from '@client/modules/settings/services/setting-app/setting-app.service';
import {Setting} from '@client/modules/settings/classes/setting.class';
/* Native Dependencies */
import {BitcoinService} from '@client/modules/bitcoin/services/bitcoin/bitcoin.service';
import {BitcoinNetworkInfo} from '@client/modules/bitcoin/classes/bitcoin-network-info.class';
import {BitcoinBlockchainInfo} from '@client/modules/bitcoin/classes/bitcoin-blockchain-info.class';
/* Shared Dependencies */
import {SettingKey} from '@shared/generated.types';

@Component({
	selector: 'orc-bitcoin-section',
	standalone: false,
	templateUrl: './bitcoin-section.component.html',
	styleUrl: './bitcoin-section.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BitcoinSectionComponent implements OnInit, OnDestroy {
	public bitcoin_blockchain_info: WritableSignal<BitcoinBlockchainInfo | null> = signal(null);
	public bitcoin_network_info: WritableSignal<BitcoinNetworkInfo | null> = signal(null);
	public active_sub_section: WritableSignal<string> = signal('');
	public show_oracle: WritableSignal<boolean> = signal(false);

	private subscriptions: Subscription = new Subscription();

	constructor(
		private bitcoinService: BitcoinService,
		private settingAppService: SettingAppService,
		private router: Router,
		private route: ActivatedRoute,
	) {}

	ngOnInit(): void {
		this.bitcoinService.loadBitcoinNetworkInfo().subscribe({
			next: (info: BitcoinNetworkInfo) => {
				this.bitcoin_network_info.set(info);
			},
			error: (error) => {
				console.error(error);
			},
		});
		this.settingAppService.loadSettings().subscribe({
			next: (settings: Setting[]) => {
				const oracle_setting = settings.find((setting: Setting) => setting.key === SettingKey.BitcoinOracle);
				const oracle_enabled = oracle_setting ? this.settingAppService.parseSettingValue(oracle_setting) : false;
				this.show_oracle.set(oracle_enabled);
			},
			error: (error) => {
				console.error(error);
			},
		});
		this.bitcoinService.loadBitcoinBlockchainInfo().subscribe();
		this.subscriptions.add(this.getBitcoinBlockchainInfoSubscription());
		this.subscriptions.add(this.getRouterSubscription());
	}

	private getBitcoinBlockchainInfoSubscription(): Subscription {
		return this.bitcoinService.bitcoin_blockchain_info$.subscribe((info: BitcoinBlockchainInfo | null) => {
			if (info) this.bitcoin_blockchain_info.set(info);
		});
	}

	private getRouterSubscription(): Subscription {
		return this.router.events.pipe(filter((event: Event) => 'routerEvent' in event || 'type' in event)).subscribe((event) => {
			this.active_sub_section.set(this.getSubSection(event));
		});
	}

	private getSubSection(event: Event): string {
		if (event instanceof NavigationStart) {
			const segments = event.url.split('/').filter(Boolean);
			if (segments[0] !== 'index') return this.active_sub_section();
			return segments[1] || 'dashboard';
		}

		const router_event = 'routerEvent' in event ? event.routerEvent : event;
		if (router_event.type !== 1) return this.active_sub_section();
		let route = this.route.root;
		while (route.firstChild) {
			route = route.firstChild;
		}
		if (route.snapshot.data['sub_section'] === 'error') return route.snapshot.data['origin'] || '';
		return route.snapshot.data['sub_section'] || '';
	}

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}
}
