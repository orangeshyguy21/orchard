/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSubsectionDatabaseFormBackupComponent} from './mint-subsection-database-form-backup.component';

describe('MintSubsectionDatabaseFormBackupComponent', () => {
	let component: MintSubsectionDatabaseFormBackupComponent;
	let fixture: ComponentFixture<MintSubsectionDatabaseFormBackupComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionDatabaseFormBackupComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionDatabaseFormBackupComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
