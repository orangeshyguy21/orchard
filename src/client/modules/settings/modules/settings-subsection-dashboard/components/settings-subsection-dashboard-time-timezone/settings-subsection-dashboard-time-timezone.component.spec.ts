/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {SettingsSubsectionDashboardTimeTimezoneComponent} from './settings-subsection-dashboard-time-timezone.component';

describe('SettingsSubsectionDashboardTimeTimezoneComponent', () => {
	let component: SettingsSubsectionDashboardTimeTimezoneComponent;
	let fixture: ComponentFixture<SettingsSubsectionDashboardTimeTimezoneComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SettingsSubsectionDashboardTimeTimezoneComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionDashboardTimeTimezoneComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
