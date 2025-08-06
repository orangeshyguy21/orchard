import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AiChatMessageErrorComponent} from './ai-chat-message-error.component';

describe('AiChatMessageErrorComponent', () => {
	let component: AiChatMessageErrorComponent;
	let fixture: ComponentFixture<AiChatMessageErrorComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AiChatMessageErrorComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(AiChatMessageErrorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
