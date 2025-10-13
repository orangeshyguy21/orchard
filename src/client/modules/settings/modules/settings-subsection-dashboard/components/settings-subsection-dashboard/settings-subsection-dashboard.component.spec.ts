/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcSettingsSubsectionDashboardModule} from '@client/modules/settings/modules/settings-subsection-dashboard/settings-subsection-dashboard.module';
/* Local Dependencies */
import {SettingsSubsectionDashboardComponent} from './settings-subsection-dashboard.component';

describe('SettingsSubsectionDashboardComponent', () => {
	let component: SettingsSubsectionDashboardComponent;
	let fixture: ComponentFixture<SettingsSubsectionDashboardComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcSettingsSubsectionDashboardModule],
			declarations: [SettingsSubsectionDashboardComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionDashboardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
