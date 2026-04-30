/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcMintSubsectionConfigModule} from '@client/modules/mint/modules/mint-subsection-config/mint-subsection-config.module';
/* Local Dependencies */
import {MintSubsectionConfigNut22Component} from './mint-subsection-config-nut22.component';

describe('MintSubsectionConfigNut22Component', () => {
	let component: MintSubsectionConfigNut22Component;
	let fixture: ComponentFixture<MintSubsectionConfigNut22Component>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionConfigModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionConfigNut22Component);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('nut22', {bat_max_mint: 0, protected_endpoints: []});
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
