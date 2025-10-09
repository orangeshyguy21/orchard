/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcNavModule} from '@client/modules/nav/nav.module';
/* Local Dependencies */
import {NavPrimaryFooterComponent} from './nav-primary-footer.component';

describe('NavPrimaryFooterComponent', () => {
	let component: NavPrimaryFooterComponent;
	let fixture: ComponentFixture<NavPrimaryFooterComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcNavModule],
		}).compileComponents();

		fixture = TestBed.createComponent(NavPrimaryFooterComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
