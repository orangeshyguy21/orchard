import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GraphicStatusComponent} from './graphic-status.component';

describe('GraphicStatusComponent', () => {
	let component: GraphicStatusComponent;
	let fixture: ComponentFixture<GraphicStatusComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [GraphicStatusComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(GraphicStatusComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
