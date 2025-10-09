/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControl, FormGroup, Validators} from '@angular/forms';
/* Vendor Dependencies */
import {provideLuxonDateAdapter} from '@angular/material-luxon-adapter';
/* Native Dependencies */
import {OrcMintSubsectionConfigModule} from '@client/modules/mint/modules/mint-subsection-config/mint-subsection-config.module';
/* Local Dependencies */
import {MintSubsectionConfigFormMinComponent} from './mint-subsection-config-form-min.component';

describe('MintSubsectionConfigFormMinComponent', () => {
	let component: MintSubsectionConfigFormMinComponent;
	let fixture: ComponentFixture<MintSubsectionConfigFormMinComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionConfigModule],
			providers: [provideLuxonDateAdapter()],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionConfigFormMinComponent);
		component = fixture.componentInstance;
		component.nut = 'nut4';
		component.unit = 'sat';
		component.form_group = new FormGroup({
			min_amount: new FormControl(0, [Validators.required]),
			max_amount: new FormControl(100, [Validators.required]),
			description: new FormControl(false),
		});
		component.control_name = 'min_amount' as any;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
