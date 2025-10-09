/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
/* Native Dependencies */
import {OrcMintSubsectionInfoModule} from '@client/modules/mint/modules/mint-subsection-info/mint-subsection-info.module';
/* Local Dependencies */
import {MintSubsectionInfoFormUrlComponent} from './mint-subsection-info-form-url.component';

describe('MintSubsectionInfoFormUrlComponent', () => {
	let component: MintSubsectionInfoFormUrlComponent;
	let fixture: ComponentFixture<MintSubsectionInfoFormUrlComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionInfoModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionInfoFormUrlComponent);
		component = fixture.componentInstance;
		component.array_name = 'urls';
		component.control_index = 0;
		component.focused = false;
		component.form_group = new FormGroup({
			urls: new FormArray<FormControl<string | null>>([new FormControl('https://example.com')]),
		});
		component.form_array = component.form_group.get('urls') as FormArray;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
