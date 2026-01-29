import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GraphicOracleIconComponent} from './graphic-oracle-icon.component';

describe('GraphicOracleIconComponent', () => {
	let component: GraphicOracleIconComponent;
	let fixture: ComponentFixture<GraphicOracleIconComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [GraphicOracleIconComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(GraphicOracleIconComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
