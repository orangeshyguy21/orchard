/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {SettingsSubsectionDashboardTimeLocaleComponent} from './settings-subsection-dashboard-time-locale.component';

describe('SettingsSubsectionDashboardTimeLocaleComponent', () => {
	let component: SettingsSubsectionDashboardTimeLocaleComponent;
	let fixture: ComponentFixture<SettingsSubsectionDashboardTimeLocaleComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SettingsSubsectionDashboardTimeLocaleComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionDashboardTimeLocaleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
