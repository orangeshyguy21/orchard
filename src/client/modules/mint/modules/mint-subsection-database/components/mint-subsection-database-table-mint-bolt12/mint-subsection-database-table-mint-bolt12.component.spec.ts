/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSubsectionDatabaseTableMintBolt12Component} from './mint-subsection-database-table-mint-bolt12.component';

describe('MintSubsectionDatabaseTableMintBolt12Component', () => {
	let component: MintSubsectionDatabaseTableMintBolt12Component;
	let fixture: ComponentFixture<MintSubsectionDatabaseTableMintBolt12Component>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionDatabaseTableMintBolt12Component],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionDatabaseTableMintBolt12Component);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
