/* Core Dependencies */
import {ChangeDetectionStrategy, Component, WritableSignal, signal, OnInit, OnDestroy, AfterViewInit, ViewContainerRef, viewChild, inject} from '@angular/core';
import {Router, Event, ActivatedRoute, NavigationStart, NavigationEnd, NavigationCancel, NavigationError} from '@angular/router';
/* Vendor Dependencies */
import {filter, Subscription} from 'rxjs';
import {MatSidenav} from '@angular/material/sidenav';
/* Application Dependencies */
import {ConfigService} from '@client/modules/config/services/config.service';
import {FormPanelService} from '@client/modules/form/services/form-panel';

@Component({
	selector: 'orc-settings-section',
	standalone: false,
	templateUrl: './settings-section.component.html',
	styleUrl: './settings-section.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSectionComponent implements OnInit, AfterViewInit, OnDestroy {
	/* ── Injected dependencies ── */
	private readonly configService = inject(ConfigService);
	private readonly router = inject(Router);
	private readonly route = inject(ActivatedRoute);
	private readonly formPanelService = inject(FormPanelService);

	/* ── ViewChild references ── */
	private readonly formSidenav = viewChild<MatSidenav>('formSidenav');
	private readonly formPanelHost = viewChild('formPanelHost', {read: ViewContainerRef});

	/* ── Public signals ── */
	public version: WritableSignal<string> = signal('');
	public active_sub_section: WritableSignal<string> = signal('');
	public overlayed: WritableSignal<boolean> = signal(false);

	/* ── Private fields ── */
	private subscriptions: Subscription = new Subscription();

	constructor() {
		this.version.set(this.configService.config.mode.version);
	}

	ngOnInit(): void {
		this.subscriptions.add(this.getRouterSubscription());
		this.subscriptions.add(this.getOverlaySubscription());
		this.subscriptions.add(this.getPanelSubscription());
	}

	ngAfterViewInit(): void {
		const host = this.formPanelHost();
		if (host) {
			this.formPanelService.registerContainer(host);
		}
	}

	/* *******************************************************
		Subscriptions
	******************************************************** */

	private getRouterSubscription(): Subscription {
		return this.router.events.pipe(filter((event: Event) => 'routerEvent' in event || 'type' in event)).subscribe((event) => {
			this.active_sub_section.set(this.getSubSection(event));
		});
	}

	/**
	 * Subscribes to router events to control overlay visibility
	 * Shows overlay on navigation start, hides on end/cancel/error
	 */
	private getOverlaySubscription(): Subscription {
		return this.router.events.subscribe((event) => {
			if (event instanceof NavigationStart) {
				const segments = event.url.split('/').filter(Boolean);
				if (segments[0] === 'settings') this.overlayed.set(true);
			}
			if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
				this.overlayed.set(false);
			}
		});
	}

	/** Syncs the sidenav open/close state with the FormPanelService */
	private getPanelSubscription(): Subscription {
		const sub = new Subscription();
		sub.add(
			this.formPanelService.afterOpened().subscribe(() => {
				this.formSidenav()?.open();
			}),
		);
		sub.add(
			this.formPanelService.afterClosed().subscribe(() => {
				this.formSidenav()?.close();
			}),
		);
		return sub;
	}

	private getSubSection(event: Event): string {
		if (event instanceof NavigationStart) {
			const segments = event.url.split('/').filter(Boolean);
			if (segments[0] !== 'settings') return this.active_sub_section();
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

	/** Handle sidenav close via backdrop click or escape */
	public onSidenavClosed(): void {
		this.formPanelService.close();
	}

	/* *******************************************************
		Destroy
	******************************************************** */

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}
}
