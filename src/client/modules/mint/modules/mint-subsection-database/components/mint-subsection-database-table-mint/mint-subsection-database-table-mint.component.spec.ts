/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSubsectionDatabaseTableMintComponent} from './mint-subsection-database-table-mint.component';

describe('MintSubsectionDatabaseTableMintComponent', () => {
	let component: MintSubsectionDatabaseTableMintComponent;
	let fixture: ComponentFixture<MintSubsectionDatabaseTableMintComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionDatabaseTableMintComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionDatabaseTableMintComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
