/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcLightningSubsectionDashboardModule} from '@client/modules/lightning/modules/lightning-subsection-dashboard/lightning-subsection-dashboard.module';
/* Local Dependencies */
import {LightningSubsectionDashboardComponent} from './lightning-subsection-dashboard.component';

describe('LightningSubsectionDashboardComponent', () => {
	let component: LightningSubsectionDashboardComponent;
	let fixture: ComponentFixture<LightningSubsectionDashboardComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcLightningSubsectionDashboardModule],
		}).compileComponents();

		fixture = TestBed.createComponent(LightningSubsectionDashboardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
