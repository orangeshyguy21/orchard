import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AuthSubsectionInitializationComponent} from './auth-subsection-initialization.component';

describe('AuthSubsectionInitializationComponent', () => {
	let component: AuthSubsectionInitializationComponent;
	let fixture: ComponentFixture<AuthSubsectionInitializationComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AuthSubsectionInitializationComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(AuthSubsectionInitializationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
