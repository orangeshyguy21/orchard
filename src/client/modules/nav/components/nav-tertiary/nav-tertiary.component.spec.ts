/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcNavModule} from '@client/modules/nav/nav.module';
/* Local Dependencies */
import {NavTertiaryComponent} from './nav-tertiary.component';

describe('NavTertiaryComponent', () => {
	let component: NavTertiaryComponent;
	let fixture: ComponentFixture<NavTertiaryComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcNavModule],
		}).compileComponents();

		fixture = TestBed.createComponent(NavTertiaryComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
