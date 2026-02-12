/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcBitcoinGeneralModule} from '@client/modules/bitcoin/modules/bitcoin-general/bitcoin-general.module';
/* Local Dependencies */
import {BitcoinGeneralWalletSummaryComponent} from './bitcoin-general-wallet-summary.component';

describe('BitcoinGeneralWalletSummaryComponent', () => {
	let component: BitcoinGeneralWalletSummaryComponent;
	let fixture: ComponentFixture<BitcoinGeneralWalletSummaryComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcBitcoinGeneralModule],
		}).compileComponents();

		fixture = TestBed.createComponent(BitcoinGeneralWalletSummaryComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('enabled_lightning', false);
		fixture.componentRef.setInput('enabled_taproot_assets', false);
		fixture.componentRef.setInput('enabled_oracle', false);
		fixture.componentRef.setInput('bitcoin_oracle_price', null);
		fixture.componentRef.setInput('errors_lightning', []);
		fixture.componentRef.setInput('errors_taproot_assets', []);
		fixture.componentRef.setInput('lightning_accounts', []);
		fixture.componentRef.setInput('taproot_assets', {assets: []});
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
