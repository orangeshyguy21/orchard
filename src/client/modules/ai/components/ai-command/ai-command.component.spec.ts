/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcAiModule} from '@client/modules/ai/ai.module';
/* Local Dependencies */
import {AiCommandComponent} from './ai-command.component';

describe('AiCommandComponent', () => {
	let component: AiCommandComponent;
	let fixture: ComponentFixture<AiCommandComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcAiModule],
		}).compileComponents();

		fixture = TestBed.createComponent(AiCommandComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('actionable', false);
		fixture.componentRef.setInput('active_chat', false);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
