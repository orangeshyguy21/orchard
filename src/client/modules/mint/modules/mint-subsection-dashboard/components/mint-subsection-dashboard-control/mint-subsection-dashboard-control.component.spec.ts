/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcMintSubsectionDashboardModule} from '@client/modules/mint/modules/mint-subsection-dashboard/mint-subsection-dashboard.module';
/* Local Dependencies */
import {MintSubsectionDashboardControlComponent} from './mint-subsection-dashboard-control.component';

describe('MintSubsectionDashboardControlComponent', () => {
	let component: MintSubsectionDashboardControlComponent;
	let fixture: ComponentFixture<MintSubsectionDashboardControlComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionDashboardModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionDashboardControlComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
