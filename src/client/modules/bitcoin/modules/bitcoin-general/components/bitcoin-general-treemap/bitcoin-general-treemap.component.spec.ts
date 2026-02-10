/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcBitcoinGeneralModule} from '@client/modules/bitcoin/modules/bitcoin-general/bitcoin-general.module';
/* Local Dependencies */
import {BitcoinGeneralTreemapComponent} from './bitcoin-general-treemap.component';

describe('BitcoinGeneralTreemapComponent', () => {
	let component: BitcoinGeneralTreemapComponent;
	let fixture: ComponentFixture<BitcoinGeneralTreemapComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcBitcoinGeneralModule],
		}).compileComponents();

		fixture = TestBed.createComponent(BitcoinGeneralTreemapComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
