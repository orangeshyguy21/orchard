/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControl, FormGroup} from '@angular/forms';
/* Native Dependencies */
import {OrcIndexSubsectionDashboardModule} from '@client/modules/index/modules/index-subsection-dashboard/index-subsection-dashboard.module';
/* Local Dependencies */
import {IndexSubsectionDashboardBitcoinEnabledBlockchainComponent} from './index-subsection-dashboard-bitcoin-enabled-blockchain.component';

describe('IndexSubsectionDashboardBitcoinEnabledBlockchainComponent', () => {
	let component: IndexSubsectionDashboardBitcoinEnabledBlockchainComponent;
	let fixture: ComponentFixture<IndexSubsectionDashboardBitcoinEnabledBlockchainComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcIndexSubsectionDashboardModule],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionDashboardBitcoinEnabledBlockchainComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('form_group', new FormGroup({target: new FormControl(0)}));
		fixture.componentRef.setInput('control_name', 'target');
		fixture.componentRef.setInput('block', {
			time: 0,
			height: 1,
			weight: 0,
			nTx: 0,
			feerate_low: 0,
			feerate_high: 0,
		} as any);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
