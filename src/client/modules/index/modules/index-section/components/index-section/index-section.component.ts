/* Core Dependencies */
import {ChangeDetectionStrategy, Component, WritableSignal, signal, OnInit, OnDestroy} from '@angular/core';
import {Router, Event, ActivatedRoute} from '@angular/router';
/* Vendor Dependencies */
import {filter, Subscription} from 'rxjs';
/* Application Dependencies */
import {ConfigService} from '@client/modules/config/services/config.service';

@Component({
	selector: 'orc-index-section',
	standalone: false,
	templateUrl: './index-section.component.html',
	styleUrl: './index-section.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexSectionComponent implements OnInit, OnDestroy {
	public version: WritableSignal<string> = signal('');
	public active_sub_section: WritableSignal<string> = signal('');

	private subscriptions: Subscription = new Subscription();

	constructor(
		private configService: ConfigService,
		private router: Router,
		private route: ActivatedRoute,
	) {
		this.version.set(this.configService.config.mode.version);
	}

	ngOnInit(): void {
		this.subscriptions.add(this.getRouterSubscription());
	}

	private getRouterSubscription(): Subscription {
		return this.router.events.pipe(filter((event: Event) => 'routerEvent' in event || 'type' in event)).subscribe((event) => {
			this.active_sub_section.set(this.getSubSection(event));
		});
	}

	private getSubSection(event: Event): string {
		const router_event = 'routerEvent' in event ? event.routerEvent : event;
		if (router_event.type !== 1) return '';
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
