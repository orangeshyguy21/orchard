/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControl, FormGroup, Validators} from '@angular/forms';
/* Vendor Dependencies */
import {provideLuxonDateAdapter} from '@angular/material-luxon-adapter';
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
			providers: [provideLuxonDateAdapter()],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionConfigFormBolt11Component);
		component = fixture.componentInstance;
		component.nut = 'nut4';
		component.unit = 'sat';
		component.method = 'bolt11';
		component.form_group = new FormGroup({
			sat: new FormGroup({
				bolt11: new FormGroup({
					min_amount: new FormControl(0, [Validators.required]),
					max_amount: new FormControl(100, [Validators.required]),
					description: new FormControl(false),
				}),
			}),
		});
		component.form_status = false;
		component.locale = 'en-US';
		component.loading = false;
		component.quotes = [];
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
