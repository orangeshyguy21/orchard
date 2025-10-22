import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsSubsectionUserUserPasswordComponent} from './settings-subsection-user-user-password.component';

describe('SettingsSubsectionUserUserPasswordComponent', () => {
	let component: SettingsSubsectionUserUserPasswordComponent;
	let fixture: ComponentFixture<SettingsSubsectionUserUserPasswordComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SettingsSubsectionUserUserPasswordComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionUserUserPasswordComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
