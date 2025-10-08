/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControl} from '@angular/forms';
/* Native Dependencies */
import {OrcAiModule} from '@client/modules/ai/ai.module';
/* Local Dependencies */
import {AiInputComponent} from './ai-input.component';

describe('AiInputComponent', () => {
	let component: AiInputComponent;
	let fixture: ComponentFixture<AiInputComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcAiModule],
			declarations: [AiInputComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(AiInputComponent);
		component = fixture.componentInstance;
		component.content = new FormControl('');
		component.model = 'test-model';
		component.active_chat = false;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
