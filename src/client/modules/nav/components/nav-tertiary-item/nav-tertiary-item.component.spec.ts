/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {NavTertiaryItemComponent} from './nav-tertiary-item.component';

describe('NavTertiaryItemComponent', () => {
	let component: NavTertiaryItemComponent;
	let fixture: ComponentFixture<NavTertiaryItemComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [NavTertiaryItemComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(NavTertiaryItemComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
