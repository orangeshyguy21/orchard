/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormGroup, FormControl} from '@angular/forms';
/* Native Dependencies */
import {OrcSettingsSubsectionAppModule} from '@client/modules/settings/modules/settings-subsection-app/settings-subsection-app.module';
/* Local Dependencies */
import {SettingsSubsectionAppAiMessagingComponent} from './settings-subsection-app-ai-messaging.component';

describe('SettingsSubsectionAppAiMessagingComponent', () => {
	let component: SettingsSubsectionAppAiMessagingComponent;
	let fixture: ComponentFixture<SettingsSubsectionAppAiMessagingComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcSettingsSubsectionAppModule],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionAppAiMessagingComponent);
		component = fixture.componentInstance;

		fixture.componentRef.setInput(
			'form_group',
			new FormGroup({
				telegram_bot_token: new FormControl(''),
			}),
		);

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
