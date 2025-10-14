/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcIndexSubsectionDashboardModule} from '@client/modules/index/modules/index-subsection-dashboard/index-subsection-dashboard.module';
/* Local Dependencies */
import {IndexSubsectionDashboardBitcoinEnabledInfoComponent} from './index-subsection-dashboard-bitcoin-enabled-info.component';

describe('IndexSubsectionDashboardBitcoinEnabledInfoComponent', () => {
	let component: IndexSubsectionDashboardBitcoinEnabledInfoComponent;
	let fixture: ComponentFixture<IndexSubsectionDashboardBitcoinEnabledInfoComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcIndexSubsectionDashboardModule],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionDashboardBitcoinEnabledInfoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
