import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AuthPasswordComponent} from './auth-password.component';

describe('AuthPasswordComponent', () => {
	let component: AuthPasswordComponent;
	let fixture: ComponentFixture<AuthPasswordComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AuthPasswordComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(AuthPasswordComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
