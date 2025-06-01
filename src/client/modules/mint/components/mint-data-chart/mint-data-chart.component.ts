/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
/* Vendor Dependencies */
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ScaleChartOptions, ChartType as ChartJsType } from 'chart.js';
import { DateTime } from 'luxon';
/* Application Dependencies */
import { NonNullableMintDatabaseSettings } from '@client/modules/chart/services/chart/chart.types';
import { 
	getAmountData,
	getAllPossibleTimestamps,
	getYAxisId,
} from '@client/modules/chart/helpers/mint-chart-data.helpers';
import { 
	getXAxisConfig,
	getYAxis,
	getBtcYAxisConfig,
	getFiatYAxisConfig,
	getTooltipTitle,
	getTooltipLabel,
} from '@client/modules/chart/helpers/mint-chart-options.helpers';
import { ChartService } from '@client/modules/chart/services/chart/chart.service';
/* Native Dependencies */
import { MintData } from '@client/modules/mint/components/mint-subsection-database/mint-subsection-database.component';

@Component({
	selector: 'orc-mint-data-chart',
	standalone: false,
	templateUrl: './mint-data-chart.component.html',
	styleUrl: './mint-data-chart.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('fadeInOut', [
			transition(':enter', [
				style({ opacity: 0 }),
				animate('150ms ease-in', style({ opacity: 1 }))
			]),
			transition(':leave', [
				animate('150ms ease-out', style({ opacity: 0 }))
			])
		])
	]
})
export class MintDataChartComponent {

	@ViewChild(BaseChartDirective) chart?: BaseChartDirective;

	@Input() public locale!: string;
	@Input() public data!: MintData;
	@Input() public chart_settings!: NonNullableMintDatabaseSettings | undefined;
	@Input() public mint_genesis_time!: number;
	@Input() public loading!: boolean;

	public chart_type!: ChartJsType;
	public chart_data!: ChartConfiguration['data'];
	public chart_options!: ChartConfiguration['options'];

	constructor(
		private chartService: ChartService,
	) { }

	public ngOnChanges(changes: SimpleChanges): void {
		if(changes['loading'] && this.loading === false) {
			this.init();
		}
	}

	private async init(): Promise<void> {
		this.chart_type = 'line';
		console.log(this.data);
		// const valid_keysets_ids = this.keysets
		// 	.filter(keyset => this.chart_settings?.status.includes(keyset.active))
		// 	.filter(keyset => this.chart_settings?.units.includes(keyset.unit))
		// 	.map(keyset => keyset.id);
		// const valid_analytics = this.keysets_analytics.filter(analytic => valid_keysets_ids.includes(analytic.keyset_id));
		// const valid_analytics_pre = this.keysets_analytics_pre.filter(analytic => valid_keysets_ids.includes(analytic.keyset_id));
		// this.chart_data = this.getChartData(valid_analytics, valid_analytics_pre);
		// this.chart_options = this.getChartOptions(valid_keysets_ids);
		// if(this.chart_options?.plugins) this.chart_options.plugins.annotation = this.getAnnotations();
	}
}