/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {SettingsSubsectionDashboardThemeComponent} from './settings-subsection-dashboard-theme.component';

describe('SettingsSubsectionDashboardThemeComponent', () => {
	let component: SettingsSubsectionDashboardThemeComponent;
	let fixture: ComponentFixture<SettingsSubsectionDashboardThemeComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SettingsSubsectionDashboardThemeComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionDashboardThemeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
