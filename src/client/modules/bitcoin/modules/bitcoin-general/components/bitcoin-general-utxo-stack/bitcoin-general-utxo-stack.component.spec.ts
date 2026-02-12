/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcBitcoinGeneralModule} from '@client/modules/bitcoin/modules/bitcoin-general/bitcoin-general.module';
/* Local Dependencies */
import {BitcoinGeneralUtxoStackComponent} from './bitcoin-general-utxo-stack.component';

describe('BitcoinGeneralUtxoStackComponent', () => {
	let component: BitcoinGeneralUtxoStackComponent;
	let fixture: ComponentFixture<BitcoinGeneralUtxoStackComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcBitcoinGeneralModule],
		}).compileComponents();

		fixture = TestBed.createComponent(BitcoinGeneralUtxoStackComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('unit', 'sat');
		fixture.componentRef.setInput('coins', 0);
		fixture.componentRef.setInput('group_key', undefined);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
