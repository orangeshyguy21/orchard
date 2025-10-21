import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsSubsectionUserComponent} from './settings-subsection-user.component';

describe('SettingsSubsectionUserComponent', () => {
	let component: SettingsSubsectionUserComponent;
	let fixture: ComponentFixture<SettingsSubsectionUserComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SettingsSubsectionUserComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionUserComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
