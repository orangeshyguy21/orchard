import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LayoutInteriorComponent} from './layout-interior.component';

describe('LayoutInteriorComponent', () => {
	let component: LayoutInteriorComponent;
	let fixture: ComponentFixture<LayoutInteriorComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [LayoutInteriorComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(LayoutInteriorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
