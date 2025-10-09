/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Vendor Dependencies */
import {provideLuxonDateAdapter} from '@angular/material-luxon-adapter';
/* Native Dependencies */
import {OrcMintSubsectionDatabaseModule} from '@client/modules/mint/modules/mint-subsection-database/mint-subsection-database.module';
/* Local Dependencies */
import {MintSubsectionDatabaseTableMeltComponent} from './mint-subsection-database-table-melt.component';

describe('MintSubsectionDatabaseTableMeltComponent', () => {
	let component: MintSubsectionDatabaseTableMeltComponent;
	let fixture: ComponentFixture<MintSubsectionDatabaseTableMeltComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionDatabaseModule],
			providers: [provideLuxonDateAdapter()],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionDatabaseTableMeltComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('quote', {
			id: 'id',
			fee_reserve: 0,
			unit: 'sat',
			payment_method: 'bolt11',
			request: 'lnbc1...',
			state: 0,
		} as any);
		fixture.componentRef.setInput('loading', false);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
