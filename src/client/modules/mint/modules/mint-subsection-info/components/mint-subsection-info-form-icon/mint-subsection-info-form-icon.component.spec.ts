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
		component.form_group = new FormGroup({
			icon_url: new FormControl('', [Validators.required]),
		});
		component.control_name = 'icon_url' as any;
		component.icon_url = null;
		component.focused = false;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
