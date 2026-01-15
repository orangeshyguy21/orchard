/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Vendor Dependencies */
import {MatTableDataSource} from '@angular/material/table';
/* Native Dependencies */
import {OrcMintSubsectionDatabaseModule} from '@client/modules/mint/modules/mint-subsection-database/mint-subsection-database.module';
import {MintSubsectionDatabaseData} from '@client/modules/mint/modules/mint-subsection-database/classes/mint-subsection-database-data.class';
/* Local Dependencies */
import {MintSubsectionDatabaseTableComponent} from './mint-subsection-database-table.component';

describe('MintSubsectionDatabaseTableComponent', () => {
	let component: MintSubsectionDatabaseTableComponent;
	let fixture: ComponentFixture<MintSubsectionDatabaseTableComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionDatabaseModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionDatabaseTableComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('data', {
			type: 'MintMints',
			source: new MatTableDataSource([]),
		} as unknown as MintSubsectionDatabaseData);
		fixture.componentRef.setInput('page_settings', {
			date_start: 0,
			date_end: 0,
			units: [],
			states: [],
			type: 'mint',
			page: 1,
			page_size: 10,
		} as any);
		fixture.componentRef.setInput('keysets', [] as any);
		fixture.componentRef.setInput('loading', false);
		fixture.componentRef.setInput('loading_more', false);
		fixture.componentRef.setInput('lightning_request', null);
		fixture.componentRef.setInput('device_desktop', true);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
