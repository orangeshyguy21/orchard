/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcNavModule} from '@client/modules/nav/nav.module';
/* Local Dependencies */
import {NavPrimaryToolComponent} from './nav-primary-tool.component';

describe('NavPrimaryToolComponent', () => {
	let component: NavPrimaryToolComponent;
	let fixture: ComponentFixture<NavPrimaryToolComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcNavModule],
			declarations: [NavPrimaryToolComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(NavPrimaryToolComponent);
		component = fixture.componentInstance;
		component.icon = 'menu';
		component.navroute = '/';
		component.active = false;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
