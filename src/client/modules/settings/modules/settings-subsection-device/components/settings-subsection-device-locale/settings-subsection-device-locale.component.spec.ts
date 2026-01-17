/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcSettingsSubsectionDeviceModule} from '@client/modules/settings/modules/settings-subsection-device/settings-subsection-device.module';
/* Local Dependencies */
import {SettingsSubsectionDeviceTimeLocaleComponent} from './settings-subsection-device-time-locale.component';

describe('SettingsSubsectionDeviceTimeLocaleComponent', () => {
	let component: SettingsSubsectionDeviceTimeLocaleComponent;
	let fixture: ComponentFixture<SettingsSubsectionDeviceTimeLocaleComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcSettingsSubsectionDeviceModule],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionDeviceTimeLocaleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
