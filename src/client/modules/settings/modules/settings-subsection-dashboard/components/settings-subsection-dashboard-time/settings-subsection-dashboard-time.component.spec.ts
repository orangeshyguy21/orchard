/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {SettingsSubsectionDashboardTimeComponent} from './settings-subsection-dashboard-time.component';

describe('SettingsSubsectionDashboardTimeComponent', () => {
	let component: SettingsSubsectionDashboardTimeComponent;
	let fixture: ComponentFixture<SettingsSubsectionDashboardTimeComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SettingsSubsectionDashboardTimeComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionDashboardTimeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
