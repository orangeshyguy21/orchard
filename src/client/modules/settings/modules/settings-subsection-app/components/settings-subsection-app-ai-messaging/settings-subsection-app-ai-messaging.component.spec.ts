import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsSubsectionAppAiMessagingComponent} from './settings-subsection-app-ai-messaging.component';

describe('SettingsSubsectionAppAiMessagingComponent', () => {
	let component: SettingsSubsectionAppAiMessagingComponent;
	let fixture: ComponentFixture<SettingsSubsectionAppAiMessagingComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SettingsSubsectionAppAiMessagingComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionAppAiMessagingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
