/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {SettingsSubsectionDashboardCategoriesComponent} from './settings-subsection-dashboard-categories.component';

describe('SettingsSubsectionDashboardCategoriesComponent', () => {
	let component: SettingsSubsectionDashboardCategoriesComponent;
	let fixture: ComponentFixture<SettingsSubsectionDashboardCategoriesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
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
