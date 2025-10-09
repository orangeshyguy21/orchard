/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcNavModule} from '@client/modules/nav/nav.module';
/* Local Dependencies */
import {NavPrimaryItemComponent} from './nav-primary-item.component';

describe('NavPrimaryItemComponent', () => {
	let component: NavPrimaryItemComponent;
	let fixture: ComponentFixture<NavPrimaryItemComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcNavModule],
		}).compileComponents();

		fixture = TestBed.createComponent(NavPrimaryItemComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('icon', 'home');
		fixture.componentRef.setInput('name', 'Home');
		fixture.componentRef.setInput('navroute', '/');
		fixture.componentRef.setInput('enabled', true);
		fixture.componentRef.setInput('online', true);
		fixture.componentRef.setInput('syncing', false);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
