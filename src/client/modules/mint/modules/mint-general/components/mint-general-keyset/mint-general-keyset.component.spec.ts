/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcMintGeneralModule} from '@client/modules/mint/modules/mint-general/mint-general.module';
/* Local Dependencies */
import {MintGeneralKeysetComponent} from './mint-general-keyset.component';

describe('MintGeneralKeysetComponent', () => {
	let component: MintGeneralKeysetComponent;
	let fixture: ComponentFixture<MintGeneralKeysetComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintGeneralModule],
			declarations: [MintGeneralKeysetComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintGeneralKeysetComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
