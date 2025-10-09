/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcErrorModule} from '@client/modules/error/error.module';
/* Local Dependencies */
import {ErrorResolveComponent} from './error-resolve.component';

describe('ErrorResolveComponent', () => {
	let component: ErrorResolveComponent;
	let fixture: ComponentFixture<ErrorResolveComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcErrorModule],
		}).compileComponents();

		fixture = TestBed.createComponent(ErrorResolveComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('error', {code: 20001, message: 'Test'} as any);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
