/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControl, FormGroup, Validators} from '@angular/forms';
/* Native Dependencies */
import {OrcMintSubsectionInfoModule} from '@client/modules/mint/modules/mint-subsection-info/mint-subsection-info.module';
/* Local Dependencies */
import {MintSubsectionInfoFormIconComponent} from './mint-subsection-info-form-icon.component';

describe('MintSubsectionInfoFormIconComponent', () => {
	let component: MintSubsectionInfoFormIconComponent;
	let fixture: ComponentFixture<MintSubsectionInfoFormIconComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionInfoModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionInfoFormIconComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput(
			'form_group',
			new FormGroup({
				icon_url: new FormControl('', [Validators.required]),
			}),
		);
		fixture.componentRef.setInput('control_name', 'icon_url');
		fixture.componentRef.setInput('icon_url', null);
		fixture.componentRef.setInput('focused', false);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
