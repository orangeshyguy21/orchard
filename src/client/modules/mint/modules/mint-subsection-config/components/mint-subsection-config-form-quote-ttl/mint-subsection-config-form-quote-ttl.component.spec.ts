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
		component.nut = 'nut4';
		component.form_group = new FormGroup({mint_ttl: new FormControl(0)}) as any;
		component.control_name = 'mint_ttl' as any;
		component.disabled = false;
		component.locale = 'en-US';
		component.loading = true;
		component.quotes = [] as any;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
