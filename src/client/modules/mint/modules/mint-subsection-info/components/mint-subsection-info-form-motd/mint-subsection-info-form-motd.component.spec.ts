/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControl, FormGroup, Validators} from '@angular/forms';
/* Native Dependencies */
import {OrcMintSubsectionInfoModule} from '@client/modules/mint/modules/mint-subsection-info/mint-subsection-info.module';
/* Local Dependencies */
import {MintSubsectionInfoFormMotdComponent} from './mint-subsection-info-form-motd.component';

describe('MintSubsectionInfoFormMotdComponent', () => {
	let component: MintSubsectionInfoFormMotdComponent;
	let fixture: ComponentFixture<MintSubsectionInfoFormMotdComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionInfoModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionInfoFormMotdComponent);
		component = fixture.componentInstance;
		component.form_group = new FormGroup({motd: new FormControl('', [Validators.required])});
		component.control_name = 'motd' as any;
		component.motd = null;
		fixture.componentRef.setInput('device_mobile', false);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
