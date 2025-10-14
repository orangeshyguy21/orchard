/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControl, FormGroup, Validators} from '@angular/forms';
/* Native Dependencies */
import {OrcMintSubsectionKeysetsModule} from '@client/modules/mint/modules/mint-subsection-keysets/mint-subsection-keysets.module';
/* Local Dependencies */
import {MintSubsectionKeysetsFormComponent} from './mint-subsection-keysets-form.component';

describe('MintSubsectionKeysetsFormComponent', () => {
	let component: MintSubsectionKeysetsFormComponent;
	let fixture: ComponentFixture<MintSubsectionKeysetsFormComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionKeysetsModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionKeysetsFormComponent);
		component = fixture.componentInstance;
		component.form_group = new FormGroup({
			unit: new FormControl('sat', [Validators.required]),
			input_fee_ppk: new FormControl(0, [Validators.required]),
			max_order: new FormControl(0, [Validators.required]),
		});
		component.unit_options = [{value: 'sat', label: 'sat'}];
		component.keyset_out = {unit: 'sat', derivation_path_index: 0, input_fee_ppk: 0} as any;
		component.keyset_out_balance = {balance: 0} as any;
		component.median_notes = 0;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
