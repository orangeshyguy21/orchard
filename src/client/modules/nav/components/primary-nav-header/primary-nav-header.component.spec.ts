/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Application Dependencies */
import {GraphicService} from '@client/modules/graphic/services/graphic/graphic.service';
/* Native Dependencies */
import {OrcNavModule} from '@client/modules/nav/nav.module';
/* Local Dependencies */
import {PrimaryNavHeaderComponent} from './primary-nav-header.component';

describe('PrimaryNavHeaderComponent', () => {
	let component: PrimaryNavHeaderComponent;
	let fixture: ComponentFixture<PrimaryNavHeaderComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcNavModule],
		}).compileComponents();

		// Initialize icon registry for orchard logo and nav icons
		TestBed.inject(GraphicService).init();

		fixture = TestBed.createComponent(PrimaryNavHeaderComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('active', false);
		fixture.componentRef.setInput('block_count', 0);
		fixture.componentRef.setInput('chain', 'mainnet');
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
