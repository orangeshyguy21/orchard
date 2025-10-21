/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcSettingsSubsectionDashboardModule} from '@client/modules/settings/modules/settings-subsection-dashboard/settings-subsection-dashboard.module';
/* Local Dependencies */
import {SettingsSubsectionDashboardTimeLocaleComponent} from './settings-subsection-dashboard-time-locale.component';

describe('SettingsSubsectionDashboardTimeLocaleComponent', () => {
	let component: SettingsSubsectionDashboardTimeLocaleComponent;
	let fixture: ComponentFixture<SettingsSubsectionDashboardTimeLocaleComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcSettingsSubsectionDashboardModule],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionDashboardTimeLocaleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
