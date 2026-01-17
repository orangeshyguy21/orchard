/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcSettingsSubsectionDeviceModule} from '@client/modules/settings/modules/settings-subsection-device/settings-subsection-device.module';
/* Local Dependencies */
import {SettingsSubsectionDeviceTimeTimezoneComponent} from './settings-subsection-device-time-timezone.component';

describe('SettingsSubsectionDeviceTimeTimezoneComponent', () => {
	let component: SettingsSubsectionDeviceTimeTimezoneComponent;
	let fixture: ComponentFixture<SettingsSubsectionDeviceTimeTimezoneComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcSettingsSubsectionDeviceModule],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionDeviceTimeTimezoneComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
