import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AuthGeneralFormcontrolNameComponent} from './auth-general-formcontrol-name.component';

describe('AuthGeneralFormcontrolNameComponent', () => {
	let component: AuthGeneralFormcontrolNameComponent;
	let fixture: ComponentFixture<AuthGeneralFormcontrolNameComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AuthGeneralFormcontrolNameComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(AuthGeneralFormcontrolNameComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
