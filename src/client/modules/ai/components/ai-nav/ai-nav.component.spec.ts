/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {FormControl} from '@angular/forms';
/* Vendor Dependencies */
import {provideLuxonDateAdapter} from '@angular/material-luxon-adapter';
/* Native Dependencies */
import {OrcAiModule} from '@client/modules/ai/ai.module';
/* Shared Dependencies */
import {AiAgent} from '@shared/generated.types';
/* Local Dependencies */
import {AiNavComponent} from './ai-nav.component';

describe('AiNavComponent', () => {
	let component: AiNavComponent;
	let fixture: ComponentFixture<AiNavComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcAiModule],
			declarations: [AiNavComponent],
			providers: [provideLuxonDateAdapter(), provideHttpClient(), provideHttpClientTesting()],
		}).compileComponents();

		fixture = TestBed.createComponent(AiNavComponent);
		component = fixture.componentInstance;
		component.active_agent = AiAgent.Default;
		component.active_chat = false;
		component.model = null;
		component.model_options = [] as any;
		component.actionable = false;
		component.content = new FormControl('');
		component.conversation = null;
		component.tool_length = 0;
		component.log_open = false;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
