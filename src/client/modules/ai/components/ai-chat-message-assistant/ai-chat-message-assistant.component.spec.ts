import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AiChatMessageAssistantComponent} from './ai-chat-message-assistant.component';

describe('AiChatMessageAssistantComponent', () => {
	let component: AiChatMessageAssistantComponent;
	let fixture: ComponentFixture<AiChatMessageAssistantComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AiChatMessageAssistantComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(AiChatMessageAssistantComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
