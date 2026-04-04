import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GraphicGroundskeeperComponent} from './graphic-groundskeeper.component';

describe('GraphicGroundskeeperComponent', () => {
	let component: GraphicGroundskeeperComponent;
	let fixture: ComponentFixture<GraphicGroundskeeperComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [GraphicGroundskeeperComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(GraphicGroundskeeperComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
