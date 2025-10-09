/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Vendor Dependencies */
import {provideLuxonDateAdapter} from '@angular/material-luxon-adapter';
/* Native Dependencies */
import {OrcMintSubsectionDatabaseModule} from '@client/modules/mint/modules/mint-subsection-database/mint-subsection-database.module';
import {MintSubsectionDatabaseData} from '@client/modules/mint/modules/mint-subsection-database/classes/mint-subsection-database-data.class';
/* Local Dependencies */
import {MintSubsectionDatabaseChartComponent} from './mint-subsection-database-chart.component';

describe('MintSubsectionDatabaseChartComponent', () => {
	let component: MintSubsectionDatabaseChartComponent;
	let fixture: ComponentFixture<MintSubsectionDatabaseChartComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionDatabaseModule],
			declarations: [MintSubsectionDatabaseChartComponent],
			providers: [provideLuxonDateAdapter()],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionDatabaseChartComponent);
		component = fixture.componentInstance;
		component.locale = 'en-US';
		component.data = {type: 'mint', source: {data: [], filteredData: []}} as unknown as MintSubsectionDatabaseData;
		component.filter = '';
		component.page_settings = {date_start: 0, date_end: 0, units: [], states: [], type: 'mint', page: 1, page_size: 10} as any;
		component.mint_genesis_time = 0;
		component.loading = false;
		component.state_enabled = false;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
