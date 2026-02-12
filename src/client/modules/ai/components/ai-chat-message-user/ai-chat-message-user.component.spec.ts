/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcAiModule} from '@client/modules/ai/ai.module';
/* Local Dependencies */
import {AiChatMessageUserComponent} from './ai-chat-message-user.component';

describe('AiChatMessageUserComponent', () => {
	let component: AiChatMessageUserComponent;
	let fixture: ComponentFixture<AiChatMessageUserComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcAiModule],
		}).compileComponents();

		fixture = TestBed.createComponent(AiChatMessageUserComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('message', {role: 'user', content: 'Hello'});
		fixture.componentRef.setInput('user_name', 'Test User');
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
