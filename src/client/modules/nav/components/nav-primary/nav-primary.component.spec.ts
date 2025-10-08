/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {NavPrimaryComponent} from './nav-primary.component';

describe('NavPrimaryComponent', () => {
	let component: NavPrimaryComponent;
	let fixture: ComponentFixture<NavPrimaryComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [NavPrimaryComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(NavPrimaryComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
