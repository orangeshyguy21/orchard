import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsSubsectionUserUserComponent} from './settings-subsection-user-user.component';

describe('SettingsSubsectionUserUserComponent', () => {
	let component: SettingsSubsectionUserUserComponent;
	let fixture: ComponentFixture<SettingsSubsectionUserUserComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SettingsSubsectionUserUserComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionUserUserComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
