/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {NavPrimaryFooterComponent} from './nav-primary-footer.component';

describe('NavPrimaryFooterComponent', () => {
	let component: NavPrimaryFooterComponent;
	let fixture: ComponentFixture<NavPrimaryFooterComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [NavPrimaryFooterComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(NavPrimaryFooterComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
