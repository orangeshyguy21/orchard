/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcButtonModule} from '@client/modules/button/button.module';
/* Local Dependencies */
import {ButtonCopyComponent} from './button-copy.component';

describe('ButtonCopyComponent', () => {
	let component: ButtonCopyComponent;
	let fixture: ComponentFixture<ButtonCopyComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcButtonModule],
		}).compileComponents();

		fixture = TestBed.createComponent(ButtonCopyComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('text', 'test');
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
