/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcMintSubsectionConfigModule} from '@client/modules/mint/modules/mint-subsection-config/mint-subsection-config.module';
/* Local Dependencies */
import {MintSubsectionConfigNutSupportedComponent} from './mint-subsection-config-nut-supported.component';

describe('MintSubsectionConfigNutSupportedComponent', () => {
	let component: MintSubsectionConfigNutSupportedComponent;
	let fixture: ComponentFixture<MintSubsectionConfigNutSupportedComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionConfigModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionConfigNutSupportedComponent);
		component = fixture.componentInstance;
		component.supported = true;
		component.nut_index = 'nut4';
		component.nut_icon = 'bolt';
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
