/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Vendor Dependencies */
import {MatIconTestingModule} from '@angular/material/icon/testing';
/* Native Dependencies */
import {OrcRoutingModule} from '@client/modules/routing/routing.module';
/* Local Dependencies */
import {LayoutInteriorComponent} from './layout-interior.component';

describe('LayoutInteriorComponent', () => {
	let component: LayoutInteriorComponent;
	let fixture: ComponentFixture<LayoutInteriorComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcRoutingModule, MatIconTestingModule],
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
