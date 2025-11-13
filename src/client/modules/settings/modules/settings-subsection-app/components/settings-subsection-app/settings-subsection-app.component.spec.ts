import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsSubsectionAppComponent} from './settings-subsection-app.component';

describe('SettingsSubsectionAppComponent', () => {
	let component: SettingsSubsectionAppComponent;
	let fixture: ComponentFixture<SettingsSubsectionAppComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SettingsSubsectionAppComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionAppComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
