/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcSettingsSubsectionDashboardModule} from '@client/modules/settings/modules/settings-subsection-dashboard/settings-subsection-dashboard.module';
/* Local Dependencies */
import {SettingsSubsectionDashboardCategoriesComponent} from './settings-subsection-dashboard-categories.component';

describe('SettingsSubsectionDashboardCategoriesComponent', () => {
	let component: SettingsSubsectionDashboardCategoriesComponent;
	let fixture: ComponentFixture<SettingsSubsectionDashboardCategoriesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcSettingsSubsectionDashboardModule],
			declarations: [SettingsSubsectionDashboardCategoriesComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionDashboardCategoriesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
