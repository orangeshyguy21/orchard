import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FormErrorComponent} from './form-error.component';

describe('FormErrorComponent', () => {
	let component: FormErrorComponent;
	let fixture: ComponentFixture<FormErrorComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [FormErrorComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(FormErrorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
