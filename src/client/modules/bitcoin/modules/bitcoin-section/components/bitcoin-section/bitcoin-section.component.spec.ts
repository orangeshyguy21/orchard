/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
/* Native Dependencies */
import {OrcBitcoinSectionModule} from '@client/modules/bitcoin/modules/bitcoin-section/bitcoin-section.module';
/* Local Dependencies */
import {BitcoinSectionComponent} from './bitcoin-section.component';

describe('BitcoinSectionComponent', () => {
	let component: BitcoinSectionComponent;
	let fixture: ComponentFixture<BitcoinSectionComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcBitcoinSectionModule],
			providers: [provideRouter([])],
		}).compileComponents();

		fixture = TestBed.createComponent(BitcoinSectionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
