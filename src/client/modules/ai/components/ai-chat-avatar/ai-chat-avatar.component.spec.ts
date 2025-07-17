import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AiChatAvatarComponent} from './ai-chat-avatar.component';

describe('AiChatAvatarComponent', () => {
	let component: AiChatAvatarComponent;
	let fixture: ComponentFixture<AiChatAvatarComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AiChatAvatarComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(AiChatAvatarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
