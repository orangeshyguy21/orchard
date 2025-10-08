/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {BitcoinGeneralBlockComponent} from './bitcoin-general-block.component';

describe('BitcoinGeneralBlockComponent', () => {
	let component: BitcoinGeneralBlockComponent;
	let fixture: ComponentFixture<BitcoinGeneralBlockComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [BitcoinGeneralBlockComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(BitcoinGeneralBlockComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
