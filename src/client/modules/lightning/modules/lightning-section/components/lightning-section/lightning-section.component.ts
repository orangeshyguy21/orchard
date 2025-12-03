/* Core Dependencies */
import {Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, OnDestroy, WritableSignal, signal} from '@angular/core';
import {Router, Event, ActivatedRoute, NavigationStart} from '@angular/router';
/* Native Dependencies */
import {LightningService} from '@client/modules/lightning/services/lightning/lightning.service';
import {LightningInfo} from '@client/modules/lightning/classes/lightning-info.class';
/* Vendor Dependencies */
import {filter, Subscription} from 'rxjs';

@Component({
	selector: 'orc-lightning-section',
	standalone: false,
	templateUrl: './lightning-section.component.html',
	styleUrl: './lightning-section.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LightningSectionComponent implements OnInit, OnDestroy {
	public lightning_info: LightningInfo | null = null;
	public active_sub_section: WritableSignal<string> = signal('');
	public loading: boolean = true;
	public error: boolean = false;

	private subscriptions: Subscription = new Subscription();

	constructor(
		private lightningService: LightningService,
		private router: Router,
		private route: ActivatedRoute,
		private cdr: ChangeDetectorRef,
	) {}

	ngOnInit(): void {
		this.lightningService.loadLightningInfo().subscribe({
			error: (error) => {
				console.error(error);
				this.error = true;
				this.loading = false;
				this.cdr.detectChanges();
			},
		});
		this.subscriptions.add(this.getLightningInfoSubscription());
		this.subscriptions.add(this.getRouterSubscription());
	}

	private getLightningInfoSubscription(): Subscription {
		return this.lightningService.lightning_info$.subscribe((info: LightningInfo | null) => {
			if (info) this.lightning_info = info;
			this.cdr.detectChanges();
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
			if (segments[0] !== 'lightning') return this.active_sub_section();
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
