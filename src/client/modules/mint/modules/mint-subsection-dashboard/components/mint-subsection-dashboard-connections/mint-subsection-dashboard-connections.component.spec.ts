/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Vendor Dependencies */
import {MatIconTestingModule} from '@angular/material/icon/testing';
/* Native Dependencies */
import {OrcMintSubsectionDashboardModule} from '@client/modules/mint/modules/mint-subsection-dashboard/mint-subsection-dashboard.module';
/* Local Dependencies */
import {MintSubsectionDashboardConnectionsComponent} from './mint-subsection-dashboard-connections.component';

describe('MintSubsectionDashboardConnectionsComponent', () => {
	let component: MintSubsectionDashboardConnectionsComponent;
	let fixture: ComponentFixture<MintSubsectionDashboardConnectionsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionDashboardModule, MatIconTestingModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionDashboardConnectionsComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('loading', true);
		fixture.componentRef.setInput('mint_connections', []);
		fixture.componentRef.setInput('device_desktop', true);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
