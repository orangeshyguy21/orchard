/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControl, FormGroup, Validators} from '@angular/forms';
/* Native Dependencies */
import {OrcMintSubsectionInfoModule} from '@client/modules/mint/modules/mint-subsection-info/mint-subsection-info.module';
/* Local Dependencies */
import {MintSubsectionInfoFormDescriptionLongComponent} from './mint-subsection-info-form-description-long.component';

describe('MintSubsectionInfoFormDescriptionLongComponent', () => {
	let component: MintSubsectionInfoFormDescriptionLongComponent;
	let fixture: ComponentFixture<MintSubsectionInfoFormDescriptionLongComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionInfoModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionInfoFormDescriptionLongComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput(
			'form_group',
			new FormGroup({
				description_long: new FormControl('', [Validators.required]),
			}),
		);
		fixture.componentRef.setInput('control_name', 'description_long');
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
