import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GraphicAssetComponent} from './graphic-asset.component';

describe('GraphicAssetComponent', () => {
	let component: GraphicAssetComponent;
	let fixture: ComponentFixture<GraphicAssetComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [GraphicAssetComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(GraphicAssetComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
