/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcNavModule} from '@client/modules/nav/nav.module';
/* Local Dependencies */
import {NavMobileComponent} from './nav-mobile.component';

describe('NavMobileComponent', () => {
	let component: NavMobileComponent;
	let fixture: ComponentFixture<NavMobileComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcNavModule],
		}).compileComponents();

		fixture = TestBed.createComponent(NavMobileComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('opened', false);
		fixture.componentRef.setInput('active_section', 'index');
		fixture.componentRef.setInput('active_sub_section', 'dashboard');
		fixture.componentRef.setInput('active_event', null);
		fixture.componentRef.setInput('enabled_ai', false);
		fixture.componentRef.setInput('enabled_bitcoin', true);
		fixture.componentRef.setInput('enabled_lightning', true);
		fixture.componentRef.setInput('enabled_mint', true);
		fixture.componentRef.setInput('online_bitcoin', true);
		fixture.componentRef.setInput('online_lightning', true);
		fixture.componentRef.setInput('online_mint', true);
		fixture.componentRef.setInput('syncing_bitcoin', false);
		fixture.componentRef.setInput('syncing_lightning', false);
		fixture.componentRef.setInput('block_count', 0);
		fixture.componentRef.setInput('user_name', 'TestUser');
		fixture.componentRef.setInput('device_type', 'mobile');
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
