/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControl, FormGroup, Validators} from '@angular/forms';
/* Native Dependencies */
import {OrcSettingsSubsectionUserModule} from '@client/modules/settings/modules/settings-subsection-user/settings-subsection-user.module';
/* Local Dependencies */
import {SettingsSubsectionUserUserNameComponent} from './settings-subsection-user-user-name.component';

describe('SettingsSubsectionUserUserNameComponent', () => {
	let component: SettingsSubsectionUserUserNameComponent;
	let fixture: ComponentFixture<SettingsSubsectionUserUserNameComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcSettingsSubsectionUserModule],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionUserUserNameComponent);
		component = fixture.componentInstance;

		const form_group = new FormGroup({
			name: new FormControl('TestUser', {validators: [Validators.required]}),
		});

		fixture.componentRef.setInput('form_group', form_group);
		fixture.componentRef.setInput('control_name', 'name');
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
