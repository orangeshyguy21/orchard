/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Vendor Dependencies */
import {Chart} from 'chart.js';
/* Native Dependencies */
import {OrcMintSubsectionDatabaseModule} from '@client/modules/mint/modules/mint-subsection-database/mint-subsection-database.module';
import {MintSubsectionDatabaseData} from '@client/modules/mint/modules/mint-subsection-database/classes/mint-subsection-database-data.class';
/* Local Dependencies */
import {MintSubsectionDatabaseChartLegendComponent} from './mint-subsection-database-chart-legend.component';

describe('MintSubsectionDatabaseChartLegendComponent', () => {
	let component: MintSubsectionDatabaseChartLegendComponent;
	let fixture: ComponentFixture<MintSubsectionDatabaseChartLegendComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionDatabaseModule],
			declarations: [MintSubsectionDatabaseChartLegendComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionDatabaseChartLegendComponent);
		component = fixture.componentInstance;
		component.data = {type: 'mint', source: {filteredData: []}} as unknown as MintSubsectionDatabaseData;
		component.chart = {} as Chart;
		component.chart_data = {datasets: []};
		component.state_enabled = false;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
