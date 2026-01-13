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
		fixture.componentRef.setInput('page_settings', {date_start: 0, date_end: 0, units: [], interval: 'day'});
		fixture.componentRef.setInput('keysets', []);
		fixture.componentRef.setInput('loading', true);
		fixture.componentRef.setInput('mint_genesis_time', 0);
		fixture.componentRef.setInput('device_desktop', true);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
