/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcMintGeneralModule} from '@client/modules/mint/modules/mint-general/mint-general.module';
/* Local Dependencies */
import {MintGeneralKeysetsComponent} from './mint-general-keysets.component';

describe('MintGeneralKeysetsComponent', () => {
	let component: MintGeneralKeysetsComponent;
	let fixture: ComponentFixture<MintGeneralKeysetsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintGeneralModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintGeneralKeysetsComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('keysets', []);
		fixture.componentRef.setInput('keysets_counts', []);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
