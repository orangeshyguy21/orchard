import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NavPrimaryStatusComponent} from './nav-primary-status.component';

describe('NavPrimaryStatusComponent', () => {
	let component: NavPrimaryStatusComponent;
	let fixture: ComponentFixture<NavPrimaryStatusComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [NavPrimaryStatusComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(NavPrimaryStatusComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
