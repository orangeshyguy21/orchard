import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AuthSubsectionInitializationFormComponent} from './auth-subsection-initialization-form.component';

describe('AuthSubsectionInitializationFormComponent', () => {
	let component: AuthSubsectionInitializationFormComponent;
	let fixture: ComponentFixture<AuthSubsectionInitializationFormComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AuthSubsectionInitializationFormComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(AuthSubsectionInitializationFormComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
