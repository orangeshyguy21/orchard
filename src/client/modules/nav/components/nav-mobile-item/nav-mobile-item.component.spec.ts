/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcNavModule} from '@client/modules/nav/nav.module';
/* Local Dependencies */
import {NavMobileItemComponent} from './nav-mobile-item.component';

describe('NavMobileItemComponent', () => {
	let component: NavMobileItemComponent;
	let fixture: ComponentFixture<NavMobileItemComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcNavModule],
		}).compileComponents();

		fixture = TestBed.createComponent(NavMobileItemComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('icon', 'home');
		fixture.componentRef.setInput('name', 'Home');
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
