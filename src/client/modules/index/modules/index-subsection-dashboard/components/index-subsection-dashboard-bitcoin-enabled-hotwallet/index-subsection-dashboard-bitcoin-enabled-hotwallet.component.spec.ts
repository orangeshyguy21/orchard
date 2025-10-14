/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcIndexSubsectionDashboardModule} from '@client/modules/index/modules/index-subsection-dashboard/index-subsection-dashboard.module';
/* Local Dependencies */
import {IndexSubsectionDashboardBitcoinEnabledHotwalletComponent} from './index-subsection-dashboard-bitcoin-enabled-hotwallet.component';

describe('IndexSubsectionDashboardBitcoinEnabledHotwalletComponent', () => {
	let component: IndexSubsectionDashboardBitcoinEnabledHotwalletComponent;
	let fixture: ComponentFixture<IndexSubsectionDashboardBitcoinEnabledHotwalletComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcIndexSubsectionDashboardModule],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionDashboardBitcoinEnabledHotwalletComponent);
		component = fixture.componentInstance;
		component.enabled_lightning = false;
		component.enabled_taproot_assets = false;
		component.errors_lightning = [] as any;
		component.errors_taproot_assets = [] as any;
		component.lightning_accounts = [] as any;
		component.taproot_assets = {assets: [], unconfirmed_transfers: '0', unconfirmed_mints: '0'} as any;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
