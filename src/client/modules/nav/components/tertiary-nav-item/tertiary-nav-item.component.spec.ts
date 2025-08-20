import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TertiaryNavItemComponent} from './tertiary-nav-item.component';

describe('TertiaryNavItemComponent', () => {
	let component: TertiaryNavItemComponent;
	let fixture: ComponentFixture<TertiaryNavItemComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [TertiaryNavItemComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(TertiaryNavItemComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
