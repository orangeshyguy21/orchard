/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcMintSubsectionConfigModule} from '@client/modules/mint/modules/mint-subsection-config/mint-subsection-config.module';
/* Local Dependencies */
import {MintSubsectionConfigNut21Component} from './mint-subsection-config-nut21.component';

describe('MintSubsectionConfigNut21Component', () => {
	let component: MintSubsectionConfigNut21Component;
	let fixture: ComponentFixture<MintSubsectionConfigNut21Component>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionConfigModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionConfigNut21Component);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('nut21', {openid_discovery: '', client_id: '', protected_endpoints: []});
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
