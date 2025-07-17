import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PrimaryNavItemsComponent} from './primary-nav-items.component';

describe('PrimaryNavItemsComponent', () => {
	let component: PrimaryNavItemsComponent;
	let fixture: ComponentFixture<PrimaryNavItemsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [PrimaryNavItemsComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(PrimaryNavItemsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
