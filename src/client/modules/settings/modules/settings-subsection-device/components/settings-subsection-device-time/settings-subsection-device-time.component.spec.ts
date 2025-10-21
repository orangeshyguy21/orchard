/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcSettingsSubsectionDeviceModule} from '@client/modules/settings/modules/settings-subsection-device/settings-subsection-device.module';
/* Local Dependencies */
import {SettingsSubsectionDeviceTimeComponent} from './settings-subsection-device-time.component';

describe('SettingsSubsectionDeviceTimeComponent', () => {
	let component: SettingsSubsectionDeviceTimeComponent;
	let fixture: ComponentFixture<SettingsSubsectionDeviceTimeComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcSettingsSubsectionDeviceModule],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionDeviceTimeComponent);
		component = fixture.componentInstance;
		component.locale = null as any;
		component.timezone = null as any;
		component.loading = true;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
