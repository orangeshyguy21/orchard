import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NavMobileSheetMenuComponent} from './nav-mobile-sheet-menu.component';

describe('NavMobileSheetMenuComponent', () => {
	let component: NavMobileSheetMenuComponent;
	let fixture: ComponentFixture<NavMobileSheetMenuComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [NavMobileSheetMenuComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(NavMobileSheetMenuComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
