/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {NavPrimaryItemComponent} from './nav-primary-item.component';

describe('NavPrimaryItemComponent', () => {
	let component: NavPrimaryItemComponent;
	let fixture: ComponentFixture<NavPrimaryItemComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [NavPrimaryItemComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(NavPrimaryItemComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
