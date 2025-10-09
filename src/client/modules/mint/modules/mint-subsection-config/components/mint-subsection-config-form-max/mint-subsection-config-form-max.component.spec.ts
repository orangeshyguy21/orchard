/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControl, FormGroup, Validators} from '@angular/forms';
/* Native Dependencies */
import {OrcMintSubsectionConfigModule} from '@client/modules/mint/modules/mint-subsection-config/mint-subsection-config.module';
/* Local Dependencies */
import {MintSubsectionConfigFormMaxComponent} from './mint-subsection-config-form-max.component';

describe('MintSubsectionConfigFormMaxComponent', () => {
	let component: MintSubsectionConfigFormMaxComponent;
	let fixture: ComponentFixture<MintSubsectionConfigFormMaxComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionConfigModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionConfigFormMaxComponent);
		component = fixture.componentInstance;
		component.unit = 'sat';
		component.nut = 'nut4';
		component.form_group = new FormGroup({
			max_amount: new FormControl(0, [Validators.required]),
		});
		component.control_name = 'max_amount' as any;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
