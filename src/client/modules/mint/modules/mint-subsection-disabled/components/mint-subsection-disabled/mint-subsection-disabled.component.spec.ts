/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcMintSubsectionDisabledModule} from '@client/modules/mint/modules/mint-subsection-disabled/mint-subsection-disabled.module';
/* Local Dependencies */
import {MintSubsectionDisabledComponent} from './mint-subsection-disabled.component';

describe('MintSubsectionDisabledComponent', () => {
	let component: MintSubsectionDisabledComponent;
	let fixture: ComponentFixture<MintSubsectionDisabledComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionDisabledModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionDisabledComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
