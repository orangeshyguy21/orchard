/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControl, FormGroup, Validators} from '@angular/forms';
/* Vendor Dependencies */
import {provideLuxonDateAdapter} from '@angular/material-luxon-adapter';
/* Native Dependencies */
import {OrcMintSubsectionDatabaseModule} from '@client/modules/mint/modules/mint-subsection-database/mint-subsection-database.module';
/* Local Dependencies */
import {MintSubsectionDatabaseFormRestoreComponent} from './mint-subsection-database-form-restore.component';

describe('MintSubsectionDatabaseFormRestoreComponent', () => {
	let component: MintSubsectionDatabaseFormRestoreComponent;
	let fixture: ComponentFixture<MintSubsectionDatabaseFormRestoreComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionDatabaseModule],
			declarations: [MintSubsectionDatabaseFormRestoreComponent],
			providers: [provideLuxonDateAdapter()],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionDatabaseFormRestoreComponent);
		component = fixture.componentInstance;
		component.active = true;
		component.form_group = new FormGroup({
			file: new FormControl(null, [Validators.required]),
			filebase64: new FormControl(''),
		});
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
