import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ChartGraphicBarsComponent} from './chart-graphic-bars.component';

describe('ChartGraphicBarsComponent', () => {
	let component: ChartGraphicBarsComponent;
	let fixture: ComponentFixture<ChartGraphicBarsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ChartGraphicBarsComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ChartGraphicBarsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
