/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControl, FormGroup, Validators} from '@angular/forms';
/* Application Dependencies */
import {User} from '@client/modules/user/classes/user.class';
import {UserRole} from '@shared/generated.types';
/* Native Dependencies */
import {OrcSettingsSubsectionUserModule} from '@client/modules/settings/modules/settings-subsection-user/settings-subsection-user.module';
/* Local Dependencies */
import {SettingsSubsectionUserUserComponent} from './settings-subsection-user-user.component';

describe('SettingsSubsectionUserUserComponent', () => {
	let component: SettingsSubsectionUserUserComponent;
	let fixture: ComponentFixture<SettingsSubsectionUserUserComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcSettingsSubsectionUserModule],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionUserUserComponent);
		component = fixture.componentInstance;

		const mock_user = new User({
			id: '1',
			name: 'TestUser',
			role: UserRole.Admin,
			active: true,
			created_at: Date.now() / 1000,
			updated_at: Date.now() / 1000,
		});

		const form_group = new FormGroup({
			name: new FormControl('TestUser', {validators: [Validators.required]}),
		});

		fixture.componentRef.setInput('user', mock_user);
		fixture.componentRef.setInput('form_group_user_name', form_group);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
