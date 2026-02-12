/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcAiModule} from '@client/modules/ai/ai.module';
/* Shared Dependencies */
import {AiMessageRole} from '@shared/generated.types';
/* Local Dependencies */
import {AiChatAvatarComponent} from './ai-chat-avatar.component';

describe('AiChatAvatarComponent', () => {
	let component: AiChatAvatarComponent;
	let fixture: ComponentFixture<AiChatAvatarComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcAiModule],
		}).compileComponents();

		fixture = TestBed.createComponent(AiChatAvatarComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('role', AiMessageRole.Assistant);
		fixture.componentRef.setInput('icon', 'person');
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
