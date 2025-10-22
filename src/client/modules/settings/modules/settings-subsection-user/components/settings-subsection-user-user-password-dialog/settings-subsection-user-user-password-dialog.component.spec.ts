import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsSubsectionUserUserPasswordDialogComponent} from './settings-subsection-user-user-password-dialog.component';

describe('SettingsSubsectionUserUserPasswordDialogComponent', () => {
	let component: SettingsSubsectionUserUserPasswordDialogComponent;
	let fixture: ComponentFixture<SettingsSubsectionUserUserPasswordDialogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SettingsSubsectionUserUserPasswordDialogComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionUserUserPasswordDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
