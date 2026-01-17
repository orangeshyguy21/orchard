/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcSettingsSubsectionDeviceModule} from '@client/modules/settings/modules/settings-subsection-device/settings-subsection-device.module';
/* Local Dependencies */
import {SettingsSubsectionDeviceLocaleComponent} from './settings-subsection-device-locale.component';

describe('SettingsSubsectionDeviceLocaleComponent', () => {
	let component: SettingsSubsectionDeviceLocaleComponent;
	let fixture: ComponentFixture<SettingsSubsectionDeviceLocaleComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcSettingsSubsectionDeviceModule],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionDeviceLocaleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
