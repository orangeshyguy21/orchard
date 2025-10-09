/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControl, FormGroup, Validators} from '@angular/forms';
/* Vendor Dependencies */
import {provideLuxonDateAdapter} from '@angular/material-luxon-adapter';
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
			providers: [provideLuxonDateAdapter()],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionDatabaseFormBackupComponent);
		component = fixture.componentInstance;
		component.active = true;
		component.form_group = new FormGroup({
			filename: new FormControl('backup', [Validators.required, Validators.maxLength(64)]),
		});
		component.database_version = '1.0.0';
		component.database_timestamp = Date.now() / 1000;
		component.database_implementation = 'sqlite';
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
