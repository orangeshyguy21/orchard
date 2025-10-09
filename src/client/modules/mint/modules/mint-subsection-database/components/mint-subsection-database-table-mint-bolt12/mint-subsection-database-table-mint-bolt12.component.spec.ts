/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcMintSubsectionDatabaseModule} from '@client/modules/mint/modules/mint-subsection-database/mint-subsection-database.module';
import {provideLuxonDateAdapter} from '@angular/material-luxon-adapter';
import {MintQuoteState} from '@shared/generated.types';
/* Local Dependencies */
import {MintSubsectionDatabaseTableMintBolt12Component} from './mint-subsection-database-table-mint-bolt12.component';

describe('MintSubsectionDatabaseTableMintBolt12Component', () => {
	let component: MintSubsectionDatabaseTableMintBolt12Component;
	let fixture: ComponentFixture<MintSubsectionDatabaseTableMintBolt12Component>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionDatabaseModule],
			declarations: [MintSubsectionDatabaseTableMintBolt12Component],
			providers: [provideLuxonDateAdapter()],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionDatabaseTableMintBolt12Component);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('quote', {
			amount_paid: 0,
			amount_issued: 0,
			unit: 'sat',
			state: MintQuoteState.Unpaid,
		} as any);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
