import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ButtonCopyComponent} from './button-copy.component';

describe('ButtonCopyComponent', () => {
	let component: ButtonCopyComponent;
	let fixture: ComponentFixture<ButtonCopyComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ButtonCopyComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ButtonCopyComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
