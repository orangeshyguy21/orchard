/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
/* Native Dependencies */
import {OrcMintSubsectionInfoModule} from '@client/modules/mint/modules/mint-subsection-info/mint-subsection-info.module';
/* Local Dependencies */
import {MintSubsectionInfoFormContactsComponent} from './mint-subsection-info-form-contacts.component';

describe('MintSubsectionInfoFormContactsComponent', () => {
	let component: MintSubsectionInfoFormContactsComponent;
	let fixture: ComponentFixture<MintSubsectionInfoFormContactsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionInfoModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionInfoFormContactsComponent);
		component = fixture.componentInstance;
		component.form_group = new FormGroup({
			contact: new FormArray([
				new FormGroup({
					method: new FormControl('email', [Validators.required]),
					info: new FormControl('test@example.com', [Validators.required]),
				}),
			]),
		});
		component.form_array = component.form_group.get('contact') as FormArray;
		component.array_name = 'contact' as any;
		component.array_length = 1;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
