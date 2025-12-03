/* Core Dependencies */
import {Component, ChangeDetectionStrategy, OnInit, Injector, afterNextRender} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
/* Vendor Dependencies */
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
export class AppComponent implements OnInit {
	constructor(
		private settingDeviceService: SettingDeviceService,
		private graphicService: GraphicService,
		private router: Router,
		private injector: Injector,
	) {}

	ngOnInit(): void {
		this.graphicService.init();
		this.settingDeviceService.init();
		// this.dismissBootstrapOverlay();
		this.waitForAppReady();
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
	 * 3. After full cycle completes (~2s), fades out and removes the overlay
	 */
	private dismissBootstrapOverlay(): void {
		console.log('dismissBootstrapOverlay');
		const overlay = document.getElementById('orc-bootstrap-overlay');
		if (!overlay) return;

		const tracking_band = document.getElementById('left-darkest');
		if (!tracking_band) {
			overlay.classList.add('fade-out');
			setTimeout(() => overlay.remove(), 2000);
			return;
		}

		tracking_band.addEventListener(
			'animationiteration',
			() => {
				overlay.classList.add('ready');
				// Wait for full lock cycle (2s) - last band peaks at 89% (~1.78s)
				setTimeout(() => {
					overlay.classList.add('fade-out');
					setTimeout(() => overlay.remove(), 800);
				}, 2000);
			},
			{once: true},
		);
	}
}
