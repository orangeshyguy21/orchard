/* Core Dependencies */
import {Component, ChangeDetectionStrategy, OnInit} from '@angular/core';
/* Vendor Dependencies */
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
	) {}

	ngOnInit(): void {
		this.graphicService.init();
		this.settingDeviceService.init();
		this.dismissBootstrapOverlay();
	}

	/**
	 * Dismisses the bootstrap loading overlay with a polished transition:
	 * 1. Waits for the current pulse animation cycle to complete
	 * 2. Triggers "solidify" animation that brings all bands to full opacity
	 * 3. Fades out and removes the overlay
	 */
	private dismissBootstrapOverlay(): void {
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
				setTimeout(() => {
					overlay.classList.add('fade-out');
					setTimeout(() => overlay.remove(), 800);
				}, 1000);
			},
			{once: true},
		);
	}
}
