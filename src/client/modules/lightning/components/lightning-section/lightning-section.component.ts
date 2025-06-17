/* Core Dependencies */
import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router, Event, ActivatedRoute } from '@angular/router';
/* Native Dependencies */
import { LightningService } from '@client/modules/lightning/services/lightning/lightning.service';
import { LightningInfo } from '@client/modules/lightning/classes/lightning-info.class';
/* Vendor Dependencies */
import { filter, Subscription } from 'rxjs';

@Component({
	selector: 'orc-lightning-section',
	standalone: false,
	templateUrl: './lightning-section.component.html',
	styleUrl: './lightning-section.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LightningSectionComponent implements OnInit, OnDestroy {

	public lightning_info: LightningInfo | null = null;
	public active_sub_section:string = '';
	public loading:boolean = true;
	public error:boolean = false;

	private subscriptions: Subscription = new Subscription();

	constructor(
		private lightningService: LightningService,
		private router: Router,
		private route: ActivatedRoute,
		private cdr: ChangeDetectorRef,
	) {}

	// ngOnInit(): void {
	// 	this.mintService.loadMintInfo().subscribe({
	// 		error: (error) => {
	// 			this.error = true;
	// 			this.loading = false;
	// 			this.cdr.detectChanges();
	// 		}
	// 	});
	// 	this.subscriptions.add(this.getMintInfoSubscription());
	// 	this.subscriptions.add(this.getRouterSubscription());
	// }

	ngOnInit(): void {
		this.lightningService.loadLightningInfo().subscribe({
			error: (error) => {
				this.error = true;
				this.loading = false;
				this.cdr.detectChanges();
			}
		});
		this.subscriptions.add(this.getLightningInfoSubscription());
		this.subscriptions.add(this.getRouterSubscription());
	}

	private getLightningInfoSubscription(): Subscription {
		return this.lightningService.lightning_info$.subscribe(
			(info:LightningInfo | null) => {
				if( info ) this.lightning_info = info;
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