/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcSettingsSubsectionDeviceModule} from '@client/modules/settings/modules/settings-subsection-device/settings-subsection-device.module';
/* Local Dependencies */
import {SettingsSubsectionDeviceThemeComponent} from './settings-subsection-device-theme.component';

describe('SettingsSubsectionDeviceThemeComponent', () => {
	let component: SettingsSubsectionDeviceThemeComponent;
	let fixture: ComponentFixture<SettingsSubsectionDeviceThemeComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcSettingsSubsectionDeviceModule],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionDeviceThemeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
