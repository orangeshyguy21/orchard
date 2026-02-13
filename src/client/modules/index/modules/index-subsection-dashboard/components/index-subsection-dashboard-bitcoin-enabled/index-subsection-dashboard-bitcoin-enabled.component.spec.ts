/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormGroup} from '@angular/forms';
import {provideRouter} from '@angular/router';
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
			providers: [provideRouter([])],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionDashboardBitcoinEnabledComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('loading', true);
		fixture.componentRef.setInput('enabled_oracle', false);
		fixture.componentRef.setInput('bitcoin_oracle_price', null);
		fixture.componentRef.setInput('enabled_lightning', false);
		fixture.componentRef.setInput('enabled_taproot_assets', false);
		fixture.componentRef.setInput('blockcount', 0);
		fixture.componentRef.setInput('blockchain_info', null);
		fixture.componentRef.setInput('block', null);
		fixture.componentRef.setInput('block_template', null);
		fixture.componentRef.setInput('network_info', null);
		fixture.componentRef.setInput('mempool', []);
		fixture.componentRef.setInput('txfee_estimate', null);
		fixture.componentRef.setInput('lightning_accounts', []);
		fixture.componentRef.setInput('taproot_assets', {assets: []});
		fixture.componentRef.setInput('errors_bitcoin', []);
		fixture.componentRef.setInput('errors_lightning', []);
		fixture.componentRef.setInput('errors_taproot_assets', []);
		fixture.componentRef.setInput('form_group', new FormGroup({}));
		fixture.componentRef.setInput('control_name', 'target');
		fixture.componentRef.setInput('device_type', 'desktop');
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
