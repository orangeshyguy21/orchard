/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcMintSubsectionConfigModule} from '@client/modules/mint/modules/mint-subsection-config/mint-subsection-config.module';
/* Local Dependencies */
import {MintSubsectionConfigFormQuoteTtlHintComponent} from './mint-subsection-config-form-quote-ttl-hint.component';

describe('MintSubsectionConfigFormQuoteTtlHintComponent', () => {
	let component: MintSubsectionConfigFormQuoteTtlHintComponent;
	let fixture: ComponentFixture<MintSubsectionConfigFormQuoteTtlHintComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionConfigModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionConfigFormQuoteTtlHintComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('deltas', []);
		fixture.componentRef.setInput('quote_ttl', 0);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
