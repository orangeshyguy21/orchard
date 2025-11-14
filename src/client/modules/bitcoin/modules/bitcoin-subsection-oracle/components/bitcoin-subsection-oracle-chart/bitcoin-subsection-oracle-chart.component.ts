/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, effect, signal, WritableSignal} from '@angular/core';
/* Vendor Dependencies */
import {BaseChartDirective} from 'ng2-charts';
import {ChartConfiguration, ScaleChartOptions, ChartType as ChartJsType} from 'chart.js';
import {DateTime} from 'luxon';
import {Subscription} from 'rxjs';
/* Application Dependencies */
import {ChartService} from '@client/modules/chart/services/chart/chart.service';
/* Native Dependencies */
import {BitcoinOraclePrice} from '@client/modules/bitcoin/classes/bitcoin-oracle-price.class';

@Component({
	selector: 'orc-bitcoin-subsection-oracle-chart',
	standalone: false,
	templateUrl: './bitcoin-subsection-oracle-chart.component.html',
	styleUrl: './bitcoin-subsection-oracle-chart.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BitcoinSubsectionOracleChartComponent {
	public loading = input.required<boolean>();
	public data = input.required<BitcoinOraclePrice[]>();

	public chart_type!: ChartJsType;
	public chart_data!: ChartConfiguration['data'];
	public chart_options!: ChartConfiguration['options'];
	public displayed: WritableSignal<boolean> = signal(true);

	private subscriptions: Subscription = new Subscription();

	constructor(private chartService: ChartService) {
		this.subscriptions.add(this.getRemoveSubscription());
		this.subscriptions.add(this.getAddSubscription());
		effect(() => {
			this.init();
		});
	}

	private getRemoveSubscription(): Subscription {
		return this.chartService.onResizeStart().subscribe(() => {
			this.displayed.set(false);
		});
	}
	private getAddSubscription(): Subscription {
		return this.chartService.onResizeEnd().subscribe(() => {
			this.displayed.set(true);
		});
	}

	private init(): void {
		// if (this.loading()) return;
		// this.chart_data = this.getChartData();
		// this.chart_options = this.getChartOptions();
		// if (this.chart_options?.plugins) this.chart_options.plugins.annotation = this.getAnnotations();
	}
}
