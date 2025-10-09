/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcAiModule} from '@client/modules/ai/ai.module';
/* Local Dependencies */
import {AiConversationHudComponent} from './ai-conversation-hud.component';

describe('AiConversationHudComponent', () => {
	let component: AiConversationHudComponent;
	let fixture: ComponentFixture<AiConversationHudComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcAiModule],
		}).compileComponents();

		fixture = TestBed.createComponent(AiConversationHudComponent);
		component = fixture.componentInstance;
		(component as any).conversation = null;
		(component as any).message_length = 0;
		(component as any).tool_length = 0;
		(component as any).log_open = false;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
