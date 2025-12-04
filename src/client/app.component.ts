/* Core Dependencies */
import {Component, ChangeDetectionStrategy, OnInit, Injector, afterNextRender, signal, OnDestroy} from '@angular/core';
import {Router, NavigationEnd, NavigationStart, NavigationCancel, NavigationError} from '@angular/router';
/* Vendor Dependencies */
import {Subscription} from 'rxjs';
import {filter, take} from 'rxjs/operators';
import annotationPlugin from 'chartjs-plugin-annotation';
import {Chart} from 'chart.js/auto';
/* Application Dependencies */
import {SettingDeviceService} from '@client/modules/settings/services/setting-device/setting-device.service';
import {GraphicService} from '@client/modules/graphic/services/graphic/graphic.service';

Chart.register(annotationPlugin);

@Component({
	selector: 'orc-root',
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: false,
})
export class AppComponent implements OnInit, OnDestroy {
	public overlayed = signal(false);

	private current_layout: 'interior' | 'exterior' | null = null;
	private subscriptions: Subscription = new Subscription();

	constructor(
		private settingDeviceService: SettingDeviceService,
		private graphicService: GraphicService,
		private router: Router,
		private injector: Injector,
	) {}

	ngOnInit(): void {
		this.subscriptions.add(this.getOverlaySubscription());
		this.graphicService.init();
		this.settingDeviceService.init();
		this.waitForAppReady();
	}

	/**
	 * Subscribes to router events to control overlay visibility
	 * Shows overlay on navigation start, hides on end/cancel/error
	 * @returns {Subscription} router events subscription
	 */
	private getOverlaySubscription(): Subscription {
		return this.router.events.subscribe((event) => {
			if (event instanceof NavigationStart) {
				const target_layout = this.getLayoutType(event.url);
				const is_layout_change = this.current_layout !== target_layout && this.current_layout !== null;
				if (is_layout_change) this.overlayed.set(true);
			}
			if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
				this.current_layout = this.getLayoutType(event.url);
				setTimeout(() => {
					this.overlayed.set(false);
				});
			}
		});
	}

	/**
	 * Determines if a URL belongs to exterior or interior layout
	 * @param {string} url - the route URL
	 * @returns {'exterior' | 'interior'} the layout type
	 */
	private getLayoutType(url: string): 'exterior' | 'interior' {
		const segments = url.split('/').filter(Boolean);
		return segments[0] === 'auth' ? 'exterior' : 'interior';
	}

	/**
	 * Waits for the first route navigation to complete (lazy module loaded)
	 * then waits for the component to render before dismissing the overlay
	 */
	private waitForAppReady(): void {
		this.router.events
			.pipe(
				filter((event) => event instanceof NavigationEnd),
				take(1),
			)
			.subscribe(() => {
				// Wait for the lazy-loaded component to render
				afterNextRender(
					async () => {
						// Wait for all fonts to be loaded
						await document.fonts.ready;
						this.dismissBootstrapOverlay();
					},
					{injector: this.injector},
				);
			});
	}

	/**
	 * Dismisses the bootstrap loading overlay with a polished transition:
	 * 1. Waits for the circular wave animation to reach the start of a cycle (position 0)
	 * 2. Triggers "lock" animation where each band stays at 100% after the wave passes
	 * 3. After full cycle completes (~1.2s), fades out and removes the overlay
	 */
	private dismissBootstrapOverlay(): void {
		const overlay = document.getElementById('orc-bootstrap-overlay');
		if (!overlay) return;

		const tracking_band = document.getElementById('left-darkest');
		if (!tracking_band) {
			overlay.classList.add('fade-out');
			setTimeout(() => overlay.remove(), 600);
			return;
		}

		tracking_band.addEventListener(
			'animationiteration',
			() => {
				overlay.classList.add('ready');
				// Wait for full lock cycle (1.2s) - last band peaks at 89% (~1.07s)
				setTimeout(() => {
					overlay.classList.add('fade-out');
					setTimeout(() => overlay.remove(), 600);
				}, 1200);
			},
			{once: true},
		);
	}

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}
}
