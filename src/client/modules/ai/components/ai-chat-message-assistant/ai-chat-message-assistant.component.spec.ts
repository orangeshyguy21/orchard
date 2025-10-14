/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcAiModule} from '@client/modules/ai/ai.module';
/* Local Dependencies */
import {AiChatMessageAssistantComponent} from './ai-chat-message-assistant.component';

describe('AiChatMessageAssistantComponent', () => {
	let component: AiChatMessageAssistantComponent;
	let fixture: ComponentFixture<AiChatMessageAssistantComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcAiModule],
			declarations: [AiChatMessageAssistantComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(AiChatMessageAssistantComponent);
		component = fixture.componentInstance;
		component.message = {role: 'assistant', content: 'Hello', done: true} as any;
		component.revision = 0;
		component.agent = null as any;
		component.active_chat = false;
		component.index = 0;
		component.conversation_length = 1;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
