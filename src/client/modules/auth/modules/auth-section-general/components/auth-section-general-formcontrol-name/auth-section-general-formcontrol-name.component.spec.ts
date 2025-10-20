import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AuthSectionGeneralFormcontrolNameComponent} from './auth-section-general-formcontrol-name.component';

describe('AuthSectionGeneralFormcontrolNameComponent', () => {
	let component: AuthSectionGeneralFormcontrolNameComponent;
	let fixture: ComponentFixture<AuthSectionGeneralFormcontrolNameComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AuthSectionGeneralFormcontrolNameComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(AuthSectionGeneralFormcontrolNameComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
