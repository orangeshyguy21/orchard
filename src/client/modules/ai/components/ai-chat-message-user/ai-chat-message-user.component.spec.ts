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
		(component as any).message = {role: 'user', content: 'Hello'} as any;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
