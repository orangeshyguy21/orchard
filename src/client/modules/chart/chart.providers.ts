/* Vendor Dependencies */
import {provideCharts} from 'ng2-charts';
import {
	Chart,
	LineController,
	BarController,
	BubbleController,
	ScatterController,
	LinearScale,
	LogarithmicScale,
	TimeScale,
	TimeSeriesScale,
	CategoryScale,
	PointElement,
	LineElement,
	BarElement,
	Tooltip,
	Filler,
	Legend,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import 'chartjs-adapter-luxon';

Chart.register(annotationPlugin);

/** Provides chart.js configuration for lazy-loaded section modules */
export function provideChartConfig() {
	return provideCharts({
		registerables: [
			LineController,
			BarController,
			BubbleController,
			ScatterController,
			LinearScale,
			LogarithmicScale,
			TimeScale,
			TimeSeriesScale,
			CategoryScale,
			PointElement,
			LineElement,
			BarElement,
			Tooltip,
			Filler,
			Legend,
		],
	});
}
