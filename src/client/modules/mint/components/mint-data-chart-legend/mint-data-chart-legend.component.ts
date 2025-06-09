/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
/* Vendor Dependencies */
import { Chart, ChartConfiguration } from 'chart.js';
/* Application Dependencies */
import { ChartService } from '@client/modules/chart/services/chart/chart.service';
/* Native Dependencies */
import { MintData } from '@client/modules/mint/components/mint-subsection-database/mint-subsection-database.component';

type LegendDataset = {
	label: string;
	color: string;
}
type LegendState = {
	label: string;
	shape: string;
}

@Component({
    selector: 'orc-mint-data-chart-legend',
    standalone: false,
    templateUrl: './mint-data-chart-legend.component.html',
    styleUrl: './mint-data-chart-legend.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintDataChartLegendComponent implements OnChanges {

	@Input() public data!: MintData;
	@Input() public chart!: Chart | undefined;
	@Input() public chart_data!: ChartConfiguration['data'];
	@Input() public state_enabled!: boolean;

	public datasets_legend!: LegendDataset[];
	public states_legend!: LegendState[];

	constructor(
		private chartService: ChartService,
		private cdr: ChangeDetectorRef
	) {}

	public ngOnChanges(changes: SimpleChanges): void {
		if(changes['chart_data'] && this.chart_data) {
			setTimeout(() => {
				this.init();
			});
		}
	}

	private init(): void {
		if( !this.chart ) return;
		this.datasets_legend = this.getDatasetsLegend();
		this.states_legend = this.getStatesLegend();
		this.cdr.detectChanges();
	}

	private getDatasetsLegend(): LegendDataset[] {
		if( !this.chart_data ) return [];
		return this.chart_data.datasets.map((dataset: any) => ({
			label: dataset.label,
			color: dataset.borderColor
		}));
	}

	private getStatesLegend(): LegendState[] {
		if( !this.data ) return [];
		// get all unique states from the data
		const states = this.data.source.filteredData.map((item: any) => item.state);
		const unique_states = Array.from(new Set(states));
		return unique_states.map((state: any) => ({
			label: state,
			shape: this.chartService.getStatePointStyle(this.data.type, state)
		}));
	}
}
