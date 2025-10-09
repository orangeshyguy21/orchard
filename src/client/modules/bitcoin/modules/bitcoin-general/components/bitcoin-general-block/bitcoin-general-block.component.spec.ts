/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcBitcoinGeneralModule} from '@client/modules/bitcoin/modules/bitcoin-general/bitcoin-general.module';
/* Local Dependencies */
import {BitcoinGeneralBlockComponent} from './bitcoin-general-block.component';

describe('BitcoinGeneralBlockComponent', () => {
	let component: BitcoinGeneralBlockComponent;
	let fixture: ComponentFixture<BitcoinGeneralBlockComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcBitcoinGeneralModule],
		}).compileComponents();

		fixture = TestBed.createComponent(BitcoinGeneralBlockComponent);
		component = fixture.componentInstance;
		component.is_template = true;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
