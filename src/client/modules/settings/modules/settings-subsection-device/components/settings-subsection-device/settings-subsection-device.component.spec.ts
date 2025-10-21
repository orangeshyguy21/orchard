/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcSettingsSubsectionDeviceModule} from '@client/modules/settings/modules/settings-subsection-device/settings-subsection-device.module';
/* Local Dependencies */
import {SettingsSubsectionDeviceComponent} from './settings-subsection-device.component';

describe('SettingsSubsectionDeviceComponent', () => {
	let component: SettingsSubsectionDeviceComponent;
	let fixture: ComponentFixture<SettingsSubsectionDeviceComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcSettingsSubsectionDeviceModule],
			declarations: [SettingsSubsectionDeviceComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionDeviceComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
