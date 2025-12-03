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

	private dismissBootstrapOverlay(): void {
		const overlay = document.getElementById('orc-bootstrap-overlay');
		if (!overlay) return;
		overlay.classList.add('fade-out');
		setTimeout(() => overlay.remove(), 4000);
	}
}
