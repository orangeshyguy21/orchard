import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, Event, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, timeout } from 'rxjs/operators';

@Component({
	selector: 'orc-primary-nav',
	standalone: false,
	templateUrl: './primary-nav.component.html',
	styleUrl: './primary-nav.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrimaryNavComponent {
	public current_route = '';
	private subscription: Subscription;

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
	) {
		this.subscription = new Subscription();
	}

	ngOnInit(): void {
		console.log('LayoutInteriorComponent ngOnInit');
		this.subscription = this.router.events
			.pipe(
				filter((event: Event) => 'routerEvent' in event || 'type' in event)
			)
			.subscribe(event => {
				const router_event = 'routerEvent' in event ? event.routerEvent : event;
				if( router_event.type !== 1 ) return;
				setTimeout(() => {
					console.log('Navigation completed:', event);
				console.log('ActivatedRoute:', this.activatedRoute.snapshot);
				}, 100);
				// console.log('Navigation completed:', event);
				// console.log('ActivatedRoute:', this.activatedRoute.snapshot);
				this.current_route = (router_event as NavigationEnd).url;
			});
	}
	
	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}
}
