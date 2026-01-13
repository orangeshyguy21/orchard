/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcMintSubsectionConfigModule} from '@client/modules/mint/modules/mint-subsection-config/mint-subsection-config.module';
/* Local Dependencies */
import {MintSubsectionConfigNutComponent} from './mint-subsection-config-nut.component';

describe('MintSubsectionConfigNutComponent', () => {
	let component: MintSubsectionConfigNutComponent;
	let fixture: ComponentFixture<MintSubsectionConfigNutComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionConfigModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionConfigNutComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('nut_index', '00');
		fixture.componentRef.setInput('supported', true);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
