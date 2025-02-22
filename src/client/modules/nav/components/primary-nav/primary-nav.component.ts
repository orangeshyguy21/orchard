/* Core Dependencies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Router, Event, ActivatedRoute } from '@angular/router';
/* Vendor Dependencies */
import { Subscription } from 'rxjs';
import { filter} from 'rxjs/operators';

@Component({
	selector: 'orc-primary-nav',
	standalone: false,
	templateUrl: './primary-nav.component.html',
	styleUrl: './primary-nav.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrimaryNavComponent {
	public active_section = '';
	private subscription: Subscription;

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private changeDetectorRef: ChangeDetectorRef
	) {
		this.subscription = new Subscription();
	}

	ngOnInit(): void {
		this.subscription = this.router.events
			.pipe(
				filter((event: Event) => 'routerEvent' in event || 'type' in event)
			)
			.subscribe(event => {
				this.setSection(event);
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
	
	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}
}
