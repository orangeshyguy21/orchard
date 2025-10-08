/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {SettingsSubsectionDashboardAiComponent} from './settings-subsection-dashboard-ai.component';

describe('SettingsSubsectionDashboardAiComponent', () => {
	let component: SettingsSubsectionDashboardAiComponent;
	let fixture: ComponentFixture<SettingsSubsectionDashboardAiComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SettingsSubsectionDashboardAiComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionDashboardAiComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
