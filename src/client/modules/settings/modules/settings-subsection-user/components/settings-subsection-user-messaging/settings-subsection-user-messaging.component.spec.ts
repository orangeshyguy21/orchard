/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControl, FormGroup} from '@angular/forms';
/* Native Dependencies */
import {OrcSettingsSubsectionUserModule} from '@client/modules/settings/modules/settings-subsection-user/settings-subsection-user.module';
/* Local Dependencies */
import {SettingsSubsectionUserMessagingComponent} from './settings-subsection-user-messaging.component';

describe('SettingsSubsectionUserMessagingComponent', () => {
	let component: SettingsSubsectionUserMessagingComponent;
	let fixture: ComponentFixture<SettingsSubsectionUserMessagingComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcSettingsSubsectionUserModule],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionUserMessagingComponent);
		component = fixture.componentInstance;

		const form_group = new FormGroup({
			telegram_chat_id: new FormControl(null),
		});

		fixture.componentRef.setInput('form_group', form_group);
		fixture.componentRef.setInput('control_name', 'telegram_chat_id');
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
