import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LayoutExteriorComponent} from './layout-exterior.component';

describe('LayoutExteriorComponent', () => {
	let component: LayoutExteriorComponent;
	let fixture: ComponentFixture<LayoutExteriorComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [LayoutExteriorComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(LayoutExteriorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
