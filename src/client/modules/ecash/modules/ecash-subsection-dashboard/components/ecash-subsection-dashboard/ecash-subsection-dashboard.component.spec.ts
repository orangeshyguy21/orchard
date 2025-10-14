/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcEcashSubsectionDashboardModule} from '@client/modules/ecash/modules/ecash-subsection-dashboard/ecash-subsection-dashboard.module';
/* Local Dependencies */
import {EcashSubsectionDashboardComponent} from './ecash-subsection-dashboard.component';

describe('EcashSubsectionDashboardComponent', () => {
	let component: EcashSubsectionDashboardComponent;
	let fixture: ComponentFixture<EcashSubsectionDashboardComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcEcashSubsectionDashboardModule],
		}).compileComponents();

		fixture = TestBed.createComponent(EcashSubsectionDashboardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
