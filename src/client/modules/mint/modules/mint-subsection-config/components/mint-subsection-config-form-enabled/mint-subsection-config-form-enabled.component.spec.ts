/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControl, FormGroup} from '@angular/forms';
/* Vendor Dependencies */
import {MatIconTestingModule} from '@angular/material/icon/testing';
/* Native Dependencies */
import {OrcMintSubsectionConfigModule} from '@client/modules/mint/modules/mint-subsection-config/mint-subsection-config.module';
/* Local Dependencies */
import {MintSubsectionConfigFormEnabledComponent} from './mint-subsection-config-form-enabled.component';

describe('MintSubsectionConfigFormEnabledComponent', () => {
	let component: MintSubsectionConfigFormEnabledComponent;
	let fixture: ComponentFixture<MintSubsectionConfigFormEnabledComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MatIconTestingModule, OrcMintSubsectionConfigModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionConfigFormEnabledComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('nut', 'nut4');
		fixture.componentRef.setInput('form_group', new FormGroup({enabled: new FormControl(false)}));
		fixture.componentRef.setInput('enabled', false);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
