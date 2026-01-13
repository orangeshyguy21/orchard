/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControl, FormGroup, Validators} from '@angular/forms';
/* Native Dependencies */
import {OrcMintSubsectionDatabaseModule} from '@client/modules/mint/modules/mint-subsection-database/mint-subsection-database.module';
/* Local Dependencies */
import {MintSubsectionDatabaseFormBackupComponent} from './mint-subsection-database-form-backup.component';

describe('MintSubsectionDatabaseFormBackupComponent', () => {
	let component: MintSubsectionDatabaseFormBackupComponent;
	let fixture: ComponentFixture<MintSubsectionDatabaseFormBackupComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionDatabaseModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionDatabaseFormBackupComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('active', true);
		fixture.componentRef.setInput(
			'form_group',
			new FormGroup({
				filename: new FormControl('backup', [Validators.required, Validators.maxLength(64)]),
			}),
		);
		fixture.componentRef.setInput('database_version', '1.0.0');
		fixture.componentRef.setInput('database_timestamp', Date.now() / 1000);
		fixture.componentRef.setInput('database_implementation', 'sqlite');
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
