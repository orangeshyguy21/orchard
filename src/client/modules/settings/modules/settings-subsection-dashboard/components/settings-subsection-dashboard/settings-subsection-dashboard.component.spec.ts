/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {SettingsSubsectionDashboardComponent} from './settings-subsection-dashboard.component';

describe('SettingsSubsectionDashboardComponent', () => {
	let component: SettingsSubsectionDashboardComponent;
	let fixture: ComponentFixture<SettingsSubsectionDashboardComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
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
