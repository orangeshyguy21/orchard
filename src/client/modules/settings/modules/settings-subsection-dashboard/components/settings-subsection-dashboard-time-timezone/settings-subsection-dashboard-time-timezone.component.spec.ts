/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcSettingsSubsectionDashboardModule} from '@client/modules/settings/modules/settings-subsection-dashboard/settings-subsection-dashboard.module';
/* Local Dependencies */
import {SettingsSubsectionDashboardTimeTimezoneComponent} from './settings-subsection-dashboard-time-timezone.component';

describe('SettingsSubsectionDashboardTimeTimezoneComponent', () => {
	let component: SettingsSubsectionDashboardTimeTimezoneComponent;
	let fixture: ComponentFixture<SettingsSubsectionDashboardTimeTimezoneComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcSettingsSubsectionDashboardModule],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionDashboardTimeTimezoneComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
