/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcSettingsSubsectionDashboardModule} from '@client/modules/settings/modules/settings-subsection-dashboard/settings-subsection-dashboard.module';
/* Local Dependencies */
import {SettingsSubsectionDashboardTimeComponent} from './settings-subsection-dashboard-time.component';

describe('SettingsSubsectionDashboardTimeComponent', () => {
	let component: SettingsSubsectionDashboardTimeComponent;
	let fixture: ComponentFixture<SettingsSubsectionDashboardTimeComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcSettingsSubsectionDashboardModule],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionDashboardTimeComponent);
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
