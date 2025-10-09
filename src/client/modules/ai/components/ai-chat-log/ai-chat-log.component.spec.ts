/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcAiModule} from '@client/modules/ai/ai.module';
/* Local Dependencies */
import {AiChatLogComponent} from './ai-chat-log.component';

describe('AiChatLogComponent', () => {
	let component: AiChatLogComponent;
	let fixture: ComponentFixture<AiChatLogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcAiModule],
			declarations: [AiChatLogComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(AiChatLogComponent);
		component = fixture.componentInstance;
		component.conversation = {messages: []} as any;
		component.active_chat = false;
		component.revision = 0;
		component.agent_definition = null as any;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
