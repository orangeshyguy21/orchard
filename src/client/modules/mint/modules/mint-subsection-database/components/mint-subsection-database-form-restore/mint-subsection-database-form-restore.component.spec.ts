/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSubsectionDatabaseFormRestoreComponent} from './mint-subsection-database-form-restore.component';

describe('MintSubsectionDatabaseFormRestoreComponent', () => {
	let component: MintSubsectionDatabaseFormRestoreComponent;
	let fixture: ComponentFixture<MintSubsectionDatabaseFormRestoreComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionDatabaseFormRestoreComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionDatabaseFormRestoreComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
