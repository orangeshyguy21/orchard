/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControl, FormGroup} from '@angular/forms';
/* Native Dependencies */
import {OrcMintSubsectionInfoModule} from '@client/modules/mint/modules/mint-subsection-info/mint-subsection-info.module';
/* Local Dependencies */
import {MintSubsectionInfoFormDescriptionComponent} from './mint-subsection-info-form-description.component';

describe('MintSubsectionInfoFormDescriptionComponent', () => {
	let component: MintSubsectionInfoFormDescriptionComponent;
	let fixture: ComponentFixture<MintSubsectionInfoFormDescriptionComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionInfoModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionInfoFormDescriptionComponent);
		component = fixture.componentInstance;
		component.form_group = new FormGroup({description: new FormControl('')});
		component.control_name = 'description';
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
