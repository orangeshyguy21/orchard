/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {IndexSubsectionDashboardBitcoinEnabledSyncingComponent} from './index-subsection-dashboard-bitcoin-enabled-syncing.component';

describe('IndexSubsectionDashboardBitcoinEnabledSyncingComponent', () => {
	let component: IndexSubsectionDashboardBitcoinEnabledSyncingComponent;
	let fixture: ComponentFixture<IndexSubsectionDashboardBitcoinEnabledSyncingComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [IndexSubsectionDashboardBitcoinEnabledSyncingComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionDashboardBitcoinEnabledSyncingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
