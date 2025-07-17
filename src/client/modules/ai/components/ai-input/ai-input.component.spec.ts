import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AiInputComponent} from './ai-input.component';

describe('AiInputComponent', () => {
	let component: AiInputComponent;
	let fixture: ComponentFixture<AiInputComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AiInputComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(AiInputComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
