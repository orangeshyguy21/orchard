/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControl, FormGroup} from '@angular/forms';
/* Native Dependencies */
import {OrcMintSubsectionConfigModule} from '@client/modules/mint/modules/mint-subsection-config/mint-subsection-config.module';
/* Local Dependencies */
import {MintSubsectionConfigFormBolt12Component} from './mint-subsection-config-form-bolt12.component';

describe('MintSubsectionConfigFormBolt12Component', () => {
	let component: MintSubsectionConfigFormBolt12Component;
	let fixture: ComponentFixture<MintSubsectionConfigFormBolt12Component>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionConfigModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionConfigFormBolt12Component);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('nut', 'nut5');
		fixture.componentRef.setInput('unit', 'sat');
		fixture.componentRef.setInput('method', 'mint');
		fixture.componentRef.setInput(
			'form_group',
			new FormGroup({
				sat: new FormGroup({
					mint: new FormGroup({
						min_amount: new FormControl(0),
						max_amount: new FormControl(0),
						amountless: new FormControl(false),
					}),
				}),
			}),
		);
		fixture.componentRef.setInput('form_status', false);
		fixture.componentRef.setInput('locale', 'en-US');
		fixture.componentRef.setInput('loading', true);
		fixture.componentRef.setInput('quotes', []);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
