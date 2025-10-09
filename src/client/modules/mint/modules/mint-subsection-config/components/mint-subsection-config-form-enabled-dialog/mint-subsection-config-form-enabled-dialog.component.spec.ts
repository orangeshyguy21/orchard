/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Vendor Dependencies */
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatIconTestingModule} from '@angular/material/icon/testing';
/* Native Dependencies */
import {OrcMintSubsectionConfigModule} from '@client/modules/mint/modules/mint-subsection-config/mint-subsection-config.module';
/* Local Dependencies */
import {MintSubsectionConfigFormEnabledDialogComponent} from './mint-subsection-config-form-enabled-dialog.component';

describe('MintSubsectionConfigFormEnabledDialogComponent', () => {
	let component: MintSubsectionConfigFormEnabledDialogComponent;
	let fixture: ComponentFixture<MintSubsectionConfigFormEnabledDialogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionConfigModule, MatIconTestingModule],
			declarations: [MintSubsectionConfigFormEnabledDialogComponent],
			providers: [
				{provide: MatDialogRef, useValue: {close: jasmine.createSpy('close')}},
				{provide: MAT_DIALOG_DATA, useValue: {nut: 'nut4'}},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionConfigFormEnabledDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
