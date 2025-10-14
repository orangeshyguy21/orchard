/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcMintSubsectionDatabaseModule} from '@client/modules/mint/modules/mint-subsection-database/mint-subsection-database.module';
/* Local Dependencies */
import {MintSubsectionDatabaseTableEcashComponent} from './mint-subsection-database-table-ecash.component';

describe('MintSubsectionDatabaseTableEcashComponent', () => {
	let component: MintSubsectionDatabaseTableEcashComponent;
	let fixture: ComponentFixture<MintSubsectionDatabaseTableEcashComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionDatabaseModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionDatabaseTableEcashComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('group', {keyset_ids: [], amounts: []} as any);
		fixture.componentRef.setInput('keysets', [] as any);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
