/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcIndexSubsectionDashboardModule} from '@client/modules/index/modules/index-subsection-dashboard/index-subsection-dashboard.module';
/* Application Dependencies */
import {LightningInfo} from '@client/modules/lightning/classes/lightning-info.class';
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
		component.enabled = true;
		component.loading = false;
		component.error = false;
		component.lightning_info = {version: 'v0.0.0', synced_to_chain: true, synced_to_graph: true} as unknown as LightningInfo;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
