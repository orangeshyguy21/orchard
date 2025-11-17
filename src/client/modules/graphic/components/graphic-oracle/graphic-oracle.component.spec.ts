import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GraphicOracleComponent} from './graphic-oracle.component';

describe('GraphicOracleComponent', () => {
	let component: GraphicOracleComponent;
	let fixture: ComponentFixture<GraphicOracleComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [GraphicOracleComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(GraphicOracleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
