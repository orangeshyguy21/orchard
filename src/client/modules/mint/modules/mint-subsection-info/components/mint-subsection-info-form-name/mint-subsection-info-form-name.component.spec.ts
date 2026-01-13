/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControl, FormGroup, Validators} from '@angular/forms';
/* Native Dependencies */
import {OrcMintSubsectionInfoModule} from '@client/modules/mint/modules/mint-subsection-info/mint-subsection-info.module';
/* Local Dependencies */
import {MintSubsectionInfoFormNameComponent} from './mint-subsection-info-form-name.component';

describe('MintSubsectionInfoFormNameComponent', () => {
	let component: MintSubsectionInfoFormNameComponent;
	let fixture: ComponentFixture<MintSubsectionInfoFormNameComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionInfoModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionInfoFormNameComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput(
			'form_group',
			new FormGroup({
				name: new FormControl('', [Validators.required]),
			}),
		);
		fixture.componentRef.setInput('control_name', 'name');
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
