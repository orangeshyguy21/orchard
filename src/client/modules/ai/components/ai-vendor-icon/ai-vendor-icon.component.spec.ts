import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AiVendorIconComponent} from './ai-vendor-icon.component';

describe('AiVendorIconComponent', () => {
	let component: AiVendorIconComponent;
	let fixture: ComponentFixture<AiVendorIconComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AiVendorIconComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(AiVendorIconComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should default vendor to ollama', () => {
		expect(component.src()).toBe('vendor/ollama.png');
	});

	it('should default size to 2rem', () => {
		expect(component.size()).toBe('2rem');
	});
});
