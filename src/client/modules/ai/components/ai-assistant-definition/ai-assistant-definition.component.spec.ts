import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AiAssistantDefinitionComponent} from './ai-assistant-definition.component';

describe('AiAssistantDefinitionComponent', () => {
	let component: AiAssistantDefinitionComponent;
	let fixture: ComponentFixture<AiAssistantDefinitionComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AiAssistantDefinitionComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(AiAssistantDefinitionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
