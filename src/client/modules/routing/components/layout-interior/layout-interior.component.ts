/* Core Dependencies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Event, Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
/* Vendor Dependencies */
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
/* Shared Dependencies */
import { AiAgent } from '@shared/generated.types';

@Component({
	selector: 'orc-layout-interior',
	standalone: false,
	templateUrl: './layout-interior.component.html',
	styleUrl: './layout-interior.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutInteriorComponent implements OnInit, OnDestroy {

	public active_section! : string;
	public active_agent! : AiAgent;
	
	private subscriptions: Subscription = new Subscription();

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private cdr: ChangeDetectorRef
	) { }

	ngOnInit(): void {
		const router_subscription = this.getRouterSubscription();
		this.subscriptions.add(router_subscription);
	}

	private getRouterSubscription(): Subscription {
		return this.router.events
			.pipe(
				filter((event: Event) => 'routerEvent' in event || 'type' in event)
			)
			.subscribe(event => {
				const route_data = this.getRouteData(event);
				this.setSection(route_data);
				this.setAgent(route_data);
			});
	}

	private getRouteData(event: Event): ActivatedRouteSnapshot['data'] | null {
		const router_event = 'routerEvent' in event ? event.routerEvent : event;
		if( router_event.type !== 1 ) return null;
		let route = this.route.root;
		while (route.firstChild) {
			route = route.firstChild;
		}
		return route.snapshot.data;
	}

	private setSection(route_data: ActivatedRouteSnapshot['data'] | null): void {
		if( !route_data ) return;
		this.active_section = route_data['section'] || '';
		this.cdr.detectChanges();
	}

	private setAgent(route_data: ActivatedRouteSnapshot['data'] | null): void {
		if( !route_data ) return;
		this.active_agent = route_data['agent'] || '';
		this.cdr.detectChanges();
	}

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}
}
