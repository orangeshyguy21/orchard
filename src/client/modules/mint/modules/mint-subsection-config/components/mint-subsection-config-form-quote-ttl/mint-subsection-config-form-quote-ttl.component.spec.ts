/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControl, FormGroup} from '@angular/forms';
/* Native Dependencies */
import {OrcMintSubsectionConfigModule} from '@client/modules/mint/modules/mint-subsection-config/mint-subsection-config.module';
/* Local Dependencies */
import {MintSubsectionConfigFormQuoteTtlComponent} from './mint-subsection-config-form-quote-ttl.component';

describe('MintSubsectionConfigFormQuoteTtlComponent', () => {
	let component: MintSubsectionConfigFormQuoteTtlComponent;
	let fixture: ComponentFixture<MintSubsectionConfigFormQuoteTtlComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionConfigModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionConfigFormQuoteTtlComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('nut', 'nut4');
		fixture.componentRef.setInput('form_group', new FormGroup({mint_ttl: new FormControl(0)}));
		fixture.componentRef.setInput('control_name', 'mint_ttl');
		fixture.componentRef.setInput('disabled', false);
		fixture.componentRef.setInput('locale', 'en-US');
		fixture.componentRef.setInput('loading', true);
		fixture.componentRef.setInput('quotes', []);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
