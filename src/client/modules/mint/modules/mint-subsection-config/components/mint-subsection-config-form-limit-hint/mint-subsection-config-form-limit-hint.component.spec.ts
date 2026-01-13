/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcMintSubsectionConfigModule} from '@client/modules/mint/modules/mint-subsection-config/mint-subsection-config.module';
/* Local Dependencies */
import {MintSubsectionConfigFormLimitHintComponent} from './mint-subsection-config-form-limit-hint.component';

describe('MintSubsectionConfigFormLimitHintComponent', () => {
	let component: MintSubsectionConfigFormLimitHintComponent;
	let fixture: ComponentFixture<MintSubsectionConfigFormLimitHintComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionConfigModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionConfigFormLimitHintComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('limit', 0);
		fixture.componentRef.setInput('amounts', []);
		fixture.componentRef.setInput('type', 'min');
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
