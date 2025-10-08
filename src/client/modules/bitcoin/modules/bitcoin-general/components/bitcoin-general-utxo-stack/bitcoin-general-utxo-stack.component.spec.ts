/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {BitcoinGeneralUtxoStackComponent} from './bitcoin-general-utxo-stack.component';

describe('BitcoinGeneralUtxoStackComponent', () => {
	let component: BitcoinGeneralUtxoStackComponent;
	let fixture: ComponentFixture<BitcoinGeneralUtxoStackComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [BitcoinGeneralUtxoStackComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(BitcoinGeneralUtxoStackComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
