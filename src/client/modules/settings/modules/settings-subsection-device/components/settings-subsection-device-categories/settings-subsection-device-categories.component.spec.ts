/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcSettingsSubsectionDeviceModule} from '@client/modules/settings/modules/settings-subsection-device/settings-subsection-device.module';
/* Local Dependencies */
import {SettingsSubsectionDeviceCategoriesComponent} from './settings-subsection-device-categories.component';

describe('SettingsSubsectionDeviceCategoriesComponent', () => {
	let component: SettingsSubsectionDeviceCategoriesComponent;
	let fixture: ComponentFixture<SettingsSubsectionDeviceCategoriesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcSettingsSubsectionDeviceModule],
			declarations: [SettingsSubsectionDeviceCategoriesComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionDeviceCategoriesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
