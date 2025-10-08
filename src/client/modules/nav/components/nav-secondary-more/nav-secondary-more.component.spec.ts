/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {NavSecondaryMoreComponent} from './nav-secondary-more.component';

describe('NavSecondaryMoreComponent', () => {
	let component: NavSecondaryMoreComponent;
	let fixture: ComponentFixture<NavSecondaryMoreComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [NavSecondaryMoreComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(NavSecondaryMoreComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
