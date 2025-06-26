/* Core Dependencies */
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
/* Vendor Dependencies */
import annotationPlugin from 'chartjs-plugin-annotation'; 
import Chart from 'chart.js/auto';
/* Application Dependencies */
import { SettingService } from '@client/modules/settings/services/setting/setting.service';
import { GraphicService } from '@client/modules/graphic/services/graphic/graphic.service';

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
		private settingService: SettingService,
		private graphicService: GraphicService,
	) { }

	ngOnInit(): void {
		this.graphicService.init();
		this.settingService.init();
	}
}
