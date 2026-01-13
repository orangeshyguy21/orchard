/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
/* Native Dependencies */
import {OrcMintSubsectionInfoModule} from '@client/modules/mint/modules/mint-subsection-info/mint-subsection-info.module';
/* Local Dependencies */
import {MintSubsectionInfoFormUrlsComponent} from './mint-subsection-info-form-urls.component';

describe('MintSubsectionInfoFormUrlsComponent', () => {
	let component: MintSubsectionInfoFormUrlsComponent;
	let fixture: ComponentFixture<MintSubsectionInfoFormUrlsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionInfoModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionInfoFormUrlsComponent);
		component = fixture.componentInstance;
		const form_group = new FormGroup({urls: new FormArray<FormControl<string | null>>([new FormControl('')])});
		fixture.componentRef.setInput('form_group', form_group);
		fixture.componentRef.setInput('form_array', form_group.get('urls') as FormArray);
		fixture.componentRef.setInput('array_name', 'urls');
		fixture.componentRef.setInput('array_length', 1);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
