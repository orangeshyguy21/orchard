/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {NavSecondaryItemComponent} from './nav-secondary-item.component';

describe('NavSecondaryItemComponent', () => {
	let component: NavSecondaryItemComponent;
	let fixture: ComponentFixture<NavSecondaryItemComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [NavSecondaryItemComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(NavSecondaryItemComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
