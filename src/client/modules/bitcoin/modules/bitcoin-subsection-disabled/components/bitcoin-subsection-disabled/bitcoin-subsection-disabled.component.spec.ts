/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcBitcoinSubsectionDisabledModule} from '@client/modules/bitcoin/modules/bitcoin-subsection-disabled/bitcoin-subsection-disabled.module';
/* Local Dependencies */
import {BitcoinSubsectionDisabledComponent} from './bitcoin-subsection-disabled.component';

describe('BitcoinSubsectionDisabledComponent', () => {
	let component: BitcoinSubsectionDisabledComponent;
	let fixture: ComponentFixture<BitcoinSubsectionDisabledComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcBitcoinSubsectionDisabledModule],
		}).compileComponents();

		fixture = TestBed.createComponent(BitcoinSubsectionDisabledComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
