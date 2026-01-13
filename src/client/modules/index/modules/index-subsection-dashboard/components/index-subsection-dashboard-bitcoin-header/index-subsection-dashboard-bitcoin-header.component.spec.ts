/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Vendor Dependencies */
import {MatIconTestingModule} from '@angular/material/icon/testing';
/* Native Dependencies */
import {OrcIndexSubsectionDashboardModule} from '@client/modules/index/modules/index-subsection-dashboard/index-subsection-dashboard.module';
/* Application Dependencies */
import {BitcoinNetworkInfo} from '@client/modules/bitcoin/classes/bitcoin-network-info.class';
import {BitcoinBlockchainInfo} from '@client/modules/bitcoin/classes/bitcoin-blockchain-info.class';
/* Local Dependencies */
import {IndexSubsectionDashboardBitcoinHeaderComponent} from './index-subsection-dashboard-bitcoin-header.component';

describe('IndexSubsectionDashboardBitcoinHeaderComponent', () => {
	let component: IndexSubsectionDashboardBitcoinHeaderComponent;
	let fixture: ComponentFixture<IndexSubsectionDashboardBitcoinHeaderComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MatIconTestingModule, OrcIndexSubsectionDashboardModule],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionDashboardBitcoinHeaderComponent);
		component = fixture.componentInstance;

		// set inputs using modern signal-based input API
		fixture.componentRef.setInput('enabled', true);
		fixture.componentRef.setInput('enabled_oracle', false);
		fixture.componentRef.setInput('loading', false);
		fixture.componentRef.setInput('error', false);
		fixture.componentRef.setInput('network_info', {subversion: 'Satoshi:26.0'} as unknown as BitcoinNetworkInfo);
		fixture.componentRef.setInput('blockchain_info', {initialblockdownload: false} as unknown as BitcoinBlockchainInfo);
		fixture.componentRef.setInput('device_desktop', true);

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
