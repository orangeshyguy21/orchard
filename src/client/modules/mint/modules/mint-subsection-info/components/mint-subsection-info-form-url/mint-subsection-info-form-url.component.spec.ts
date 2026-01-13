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
		const form_group = new FormGroup({
			urls: new FormArray<FormControl<string | null>>([new FormControl('https://example.com')]),
		});
		fixture.componentRef.setInput('form_group', form_group);
		fixture.componentRef.setInput('form_array', form_group.get('urls') as FormArray);
		fixture.componentRef.setInput('array_name', 'urls');
		fixture.componentRef.setInput('control_index', 0);
		fixture.componentRef.setInput('focused', false);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
