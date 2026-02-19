/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcMintGeneralModule} from '@client/modules/mint/modules/mint-general/mint-general.module';
/* Local Dependencies */
import {MintGeneralKeysetVersionComponent} from './mint-general-keyset-version.component';

describe('MintGeneralKeysetVersionComponent', () => {
	let component: MintGeneralKeysetVersionComponent;
	let fixture: ComponentFixture<MintGeneralKeysetVersionComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintGeneralModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintGeneralKeysetVersionComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('id', '00abc123');
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
