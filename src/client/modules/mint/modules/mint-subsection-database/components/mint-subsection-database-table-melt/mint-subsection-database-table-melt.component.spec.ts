/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSubsectionDatabaseTableMeltComponent} from './mint-subsection-database-table-melt.component';

describe('MintSubsectionDatabaseTableMeltComponent', () => {
	let component: MintSubsectionDatabaseTableMeltComponent;
	let fixture: ComponentFixture<MintSubsectionDatabaseTableMeltComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionDatabaseTableMeltComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionDatabaseTableMeltComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
