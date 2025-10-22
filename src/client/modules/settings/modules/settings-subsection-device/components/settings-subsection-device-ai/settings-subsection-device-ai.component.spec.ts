/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcSettingsSubsectionDeviceModule} from '@client/modules/settings/modules/settings-subsection-device/settings-subsection-device.module';
/* Local Dependencies */
import {SettingsSubsectionDeviceAiComponent} from './settings-subsection-device-ai.component';

describe('SettingsSubsectionDeviceAiComponent', () => {
	let component: SettingsSubsectionDeviceAiComponent;
	let fixture: ComponentFixture<SettingsSubsectionDeviceAiComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcSettingsSubsectionDeviceModule],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionDeviceAiComponent);
		component = fixture.componentInstance;
		component.enabled = true;
		component.loading = true;
		component.error = false;
		component.model_options = [] as any;
		component.model = null as any;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
