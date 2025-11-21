/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcBitcoinSubsectionOracleModule} from '@client/modules/bitcoin/modules/bitcoin-subsection-oracle/bitcoin-subsection-oracle.module';
/* Local Dependencies */
import {BitcoinSubsectionOracleComponent} from './bitcoin-subsection-oracle.component';

describe('BitcoinSubsectionOracleComponent', () => {
	let component: BitcoinSubsectionOracleComponent;
	let fixture: ComponentFixture<BitcoinSubsectionOracleComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcBitcoinSubsectionOracleModule],
		}).compileComponents();

		fixture = TestBed.createComponent(BitcoinSubsectionOracleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
