/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControl, FormGroup, Validators} from '@angular/forms';
/* Native Dependencies */
import {OrcMintSubsectionConfigModule} from '@client/modules/mint/modules/mint-subsection-config/mint-subsection-config.module';
/* Local Dependencies */
import {MintSubsectionConfigFormBolt11Component} from './mint-subsection-config-form-bolt11.component';

describe('MintSubsectionConfigFormBolt11Component', () => {
	let component: MintSubsectionConfigFormBolt11Component;
	let fixture: ComponentFixture<MintSubsectionConfigFormBolt11Component>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionConfigModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionConfigFormBolt11Component);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('nut', 'nut4');
		fixture.componentRef.setInput('unit', 'sat');
		fixture.componentRef.setInput('method', 'bolt11');
		fixture.componentRef.setInput(
			'form_group',
			new FormGroup({
				sat: new FormGroup({
					bolt11: new FormGroup({
						min_amount: new FormControl(0, [Validators.required]),
						max_amount: new FormControl(100, [Validators.required]),
						description: new FormControl(false),
					}),
				}),
			}),
		);
		fixture.componentRef.setInput('form_status', false);
		fixture.componentRef.setInput('locale', 'en-US');
		fixture.componentRef.setInput('loading', false);
		fixture.componentRef.setInput('quotes', []);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
