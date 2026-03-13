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
		expect(component.src()).toBe('ai-vendor/ollama.png');
	});

	it('should default size to 2rem', () => {
		expect(component.size()).toBe('2rem');
	});

	it('should compute src from vendor input', () => {
		fixture.componentRef.setInput('vendor', 'openrouter');
		fixture.detectChanges();
		expect(component.src()).toBe('ai-vendor/openrouter.png');
	});

	it('should fallback to openrouter logo on image error', () => {
		const img = {src: 'http://localhost/ai-vendor/unknown.png'} as HTMLImageElement;
		component.onImageError({target: img} as unknown as Event);
		expect(img.src).toBe('ai-vendor/openrouter.png');
	});

	it('should not loop fallback if already on openrouter logo', () => {
		const img = {src: 'http://localhost/ai-vendor/openrouter.png'} as HTMLImageElement;
		component.onImageError({target: img} as unknown as Event);
		expect(img.src).toBe('http://localhost/ai-vendor/openrouter.png');
	});
});
