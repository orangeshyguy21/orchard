/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {IndexSubsectionDashboardBitcoinEnabledBlockchainComponent} from './index-subsection-dashboard-bitcoin-enabled-blockchain.component';

describe('IndexSubsectionDashboardBitcoinEnabledBlockchainComponent', () => {
	let component: IndexSubsectionDashboardBitcoinEnabledBlockchainComponent;
	let fixture: ComponentFixture<IndexSubsectionDashboardBitcoinEnabledBlockchainComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [IndexSubsectionDashboardBitcoinEnabledBlockchainComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionDashboardBitcoinEnabledBlockchainComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
