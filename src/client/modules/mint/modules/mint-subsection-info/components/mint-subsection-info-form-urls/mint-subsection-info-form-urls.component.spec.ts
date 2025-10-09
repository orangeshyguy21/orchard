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
		component.form_group = new FormGroup({urls: new FormArray<FormControl<string | null>>([new FormControl('')])});
		component.form_array = component.form_group.get('urls') as FormArray;
		component.array_name = 'urls' as any;
		component.array_length = 1;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
