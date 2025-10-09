/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcAiModule} from '@client/modules/ai/ai.module';
/* Local Dependencies */
import {AiChatMessageErrorComponent} from './ai-chat-message-error.component';

describe('AiChatMessageErrorComponent', () => {
	let component: AiChatMessageErrorComponent;
	let fixture: ComponentFixture<AiChatMessageErrorComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcAiModule],
			declarations: [AiChatMessageErrorComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(AiChatMessageErrorComponent);
		component = fixture.componentInstance;
		component.message = {role: 'system', content: 'An error occurred'} as any;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
