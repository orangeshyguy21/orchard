/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Vendor Dependencies */
import {MatIconTestingModule} from '@angular/material/icon/testing';
/* Native Dependencies */
import {OrcMintSubsectionConfigModule} from '@client/modules/mint/modules/mint-subsection-config/mint-subsection-config.module';
/* Local Dependencies */
import {MintSubsectionConfigNut15MethodComponent} from './mint-subsection-config-nut15-method.component';

describe('MintSubsectionConfigNut15MethodComponent', () => {
	let component: MintSubsectionConfigNut15MethodComponent;
	let fixture: ComponentFixture<MintSubsectionConfigNut15MethodComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MatIconTestingModule, OrcMintSubsectionConfigModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionConfigNut15MethodComponent);
		component = fixture.componentInstance;
		(component as any).nut15_method = {unit: 'sat', methods: ['bolt11', 'bolt12']};
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
