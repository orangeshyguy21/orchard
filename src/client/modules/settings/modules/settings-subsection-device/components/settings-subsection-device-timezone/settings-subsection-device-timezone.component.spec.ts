/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ComponentRef} from '@angular/core';
/* Native Dependencies */
import {OrcSettingsSubsectionDeviceModule} from '@client/modules/settings/modules/settings-subsection-device/settings-subsection-device.module';
/* Local Dependencies */
import {SettingsSubsectionDeviceTimezoneComponent} from './settings-subsection-device-timezone.component';

describe('SettingsSubsectionDeviceTimezoneComponent', () => {
	let component: SettingsSubsectionDeviceTimezoneComponent;
	let componentRef: ComponentRef<SettingsSubsectionDeviceTimezoneComponent>;
	let fixture: ComponentFixture<SettingsSubsectionDeviceTimezoneComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcSettingsSubsectionDeviceModule],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionDeviceTimezoneComponent);
		component = fixture.componentInstance;
		componentRef = fixture.componentRef;

		component.timezone = {tz: 'America/New_York'};
		component.loading = false;
		componentRef.setInput('locale', 'en-US');

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
