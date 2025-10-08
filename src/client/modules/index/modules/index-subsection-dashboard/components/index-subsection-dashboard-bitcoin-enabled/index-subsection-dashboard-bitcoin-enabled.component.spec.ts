/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcIndexSubsectionDashboardModule} from '@client/modules/index/modules/index-subsection-dashboard/index-subsection-dashboard.module';
/* Local Dependencies */
import {IndexSubsectionDashboardBitcoinEnabledComponent} from './index-subsection-dashboard-bitcoin-enabled.component';

describe('IndexSubsectionDashboardBitcoinEnabledComponent', () => {
	let component: IndexSubsectionDashboardBitcoinEnabledComponent;
	let fixture: ComponentFixture<IndexSubsectionDashboardBitcoinEnabledComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcIndexSubsectionDashboardModule],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionDashboardBitcoinEnabledComponent);
		component = fixture.componentInstance;
		component.loading = true;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
