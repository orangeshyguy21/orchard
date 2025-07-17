import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GraphicOrchardLogoComponent} from './graphic-orchard-logo.component';

describe('GraphicOrchardLogoComponent', () => {
	let component: GraphicOrchardLogoComponent;
	let fixture: ComponentFixture<GraphicOrchardLogoComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [GraphicOrchardLogoComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(GraphicOrchardLogoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
