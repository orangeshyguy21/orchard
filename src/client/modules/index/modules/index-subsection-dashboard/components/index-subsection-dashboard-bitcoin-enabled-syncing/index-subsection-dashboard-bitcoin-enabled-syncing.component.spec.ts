/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcIndexSubsectionDashboardModule} from '@client/modules/index/modules/index-subsection-dashboard/index-subsection-dashboard.module';
/* Local Dependencies */
import {IndexSubsectionDashboardBitcoinEnabledSyncingComponent} from './index-subsection-dashboard-bitcoin-enabled-syncing.component';

describe('IndexSubsectionDashboardBitcoinEnabledSyncingComponent', () => {
	let component: IndexSubsectionDashboardBitcoinEnabledSyncingComponent;
	let fixture: ComponentFixture<IndexSubsectionDashboardBitcoinEnabledSyncingComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcIndexSubsectionDashboardModule],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionDashboardBitcoinEnabledSyncingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
