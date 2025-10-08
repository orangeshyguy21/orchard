/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {NavPrimaryToolComponent} from './nav-primary-tool.component';

describe('NavPrimaryToolComponent', () => {
	let component: NavPrimaryToolComponent;
	let fixture: ComponentFixture<NavPrimaryToolComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [NavPrimaryToolComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(NavPrimaryToolComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
