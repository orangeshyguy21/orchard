/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcGraphicModule} from '@client/modules/graphic/graphic.module';
/* Local Dependencies */
import {GraphicAssetComponent} from './graphic-asset.component';

describe('GraphicAssetComponent', () => {
	let component: GraphicAssetComponent;
	let fixture: ComponentFixture<GraphicAssetComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcGraphicModule],
		}).compileComponents();

		fixture = TestBed.createComponent(GraphicAssetComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('unit', 'sat');
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
