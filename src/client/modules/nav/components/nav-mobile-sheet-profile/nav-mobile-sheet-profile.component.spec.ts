import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NavMobileSheetProfileComponent} from './nav-mobile-sheet-profile.component';

describe('NavMobileSheetProfileComponent', () => {
	let component: NavMobileSheetProfileComponent;
	let fixture: ComponentFixture<NavMobileSheetProfileComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [NavMobileSheetProfileComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(NavMobileSheetProfileComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
