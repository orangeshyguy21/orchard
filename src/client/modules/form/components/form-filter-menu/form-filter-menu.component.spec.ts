import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FormFilterMenuComponent} from './form-filter-menu.component';

describe('FormFilterMenuComponent', () => {
	let component: FormFilterMenuComponent;
	let fixture: ComponentFixture<FormFilterMenuComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [FormFilterMenuComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(FormFilterMenuComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
