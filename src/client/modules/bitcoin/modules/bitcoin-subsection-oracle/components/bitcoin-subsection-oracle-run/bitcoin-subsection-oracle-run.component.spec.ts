/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcBitcoinSubsectionOracleModule} from '@client/modules/bitcoin/modules/bitcoin-subsection-oracle/bitcoin-subsection-oracle.module';
/* Local Dependencies */
import {BitcoinSubsectionOracleRunComponent} from './bitcoin-subsection-oracle-run.component';

describe('BitcoinSubsectionOracleRunComponent', () => {
	let component: BitcoinSubsectionOracleRunComponent;
	let fixture: ComponentFixture<BitcoinSubsectionOracleRunComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcBitcoinSubsectionOracleModule],
		}).compileComponents();

		fixture = TestBed.createComponent(BitcoinSubsectionOracleRunComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
