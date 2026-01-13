/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcIndexSubsectionDashboardModule} from '@client/modules/index/modules/index-subsection-dashboard/index-subsection-dashboard.module';
/* Local Dependencies */
import {IndexSubsectionDashboardLightningHeaderComponent} from './index-subsection-dashboard-lightning-header.component';

describe('IndexSubsectionDashboardLightningHeaderComponent', () => {
	let component: IndexSubsectionDashboardLightningHeaderComponent;
	let fixture: ComponentFixture<IndexSubsectionDashboardLightningHeaderComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcIndexSubsectionDashboardModule],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionDashboardLightningHeaderComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('enabled', true);
		fixture.componentRef.setInput('loading', false);
		fixture.componentRef.setInput('error', false);
		fixture.componentRef.setInput('lightning_info', {version: 'v0.0.0', synced_to_chain: true, synced_to_graph: true});
		fixture.componentRef.setInput('device_desktop', true);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
