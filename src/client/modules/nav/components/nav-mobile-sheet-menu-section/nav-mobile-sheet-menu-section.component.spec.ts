import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NavMobileSheetMenuSectionComponent} from './nav-mobile-sheet-menu-section.component';

describe('NavMobileSheetMenuSectionComponent', () => {
	let component: NavMobileSheetMenuSectionComponent;
	let fixture: ComponentFixture<NavMobileSheetMenuSectionComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [NavMobileSheetMenuSectionComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(NavMobileSheetMenuSectionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
