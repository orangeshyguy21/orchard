/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
/* Vendor Dependencies */
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ScaleChartOptions, ChartType as ChartJsType } from 'chart.js';
import { DateTime } from 'luxon';
/* Application Dependencies */
import { NonNullableMintKeysetsSettings } from '@client/modules/chart/services/chart/chart.types';
import { 
	groupAnalyticsByUnit,
	prependData,
	getDataKeyedByTimestamp,
	getAmountData,
	getRawData,
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
import { MintKeyset } from '@client/modules/mint/classes/mint-keyset.class';
import { MintAnalyticKeyset } from '@client/modules/mint/classes/mint-analytic.class';


@Component({
	selector: 'orc-mint-keyset-chart',
	standalone: false,
	templateUrl: './mint-keyset-chart.component.html',
	styleUrl: './mint-keyset-chart.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintKeysetChartComponent {

	@ViewChild(BaseChartDirective) chart?: BaseChartDirective;

	@Input() public locale!: string;
	@Input() public keysets!: MintKeyset[];
	@Input() public keysets_analytics!: MintAnalyticKeyset[];
	@Input() public keysets_analytics_pre!: MintAnalyticKeyset[];
	@Input() public chart_settings!: NonNullableMintKeysetsSettings | undefined;
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
		if(changes['selected_type'] && !changes['selected_type'].firstChange ) {
			this.init();
		}
	}

	private async init(): Promise<void> {
		this.chart_type = 'line';
		// this.chart_data = this.getAmountChartData();
		// this.chart_options = this.getAmountChartOptions();
		// if(this.chart_options?.plugins) this.chart_options.plugins.annotation = this.getAnnotations();
	}

}
