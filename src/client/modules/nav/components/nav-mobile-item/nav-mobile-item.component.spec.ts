import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NavMobileItemComponent} from './nav-mobile-item.component';

describe('NavMobileItemComponent', () => {
	let component: NavMobileItemComponent;
	let fixture: ComponentFixture<NavMobileItemComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [NavMobileItemComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(NavMobileItemComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
