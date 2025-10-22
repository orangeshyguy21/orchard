import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsSubsectionUserUserNameComponent} from './settings-subsection-user-user-name.component';

describe('SettingsSubsectionUserUserNameComponent', () => {
	let component: SettingsSubsectionUserUserNameComponent;
	let fixture: ComponentFixture<SettingsSubsectionUserUserNameComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SettingsSubsectionUserUserNameComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionUserUserNameComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
