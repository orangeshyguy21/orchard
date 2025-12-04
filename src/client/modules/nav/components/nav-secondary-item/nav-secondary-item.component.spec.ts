/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
/* Local Dependencies */
import {NavSecondaryItemComponent} from './nav-secondary-item.component';

describe('NavSecondaryItemComponent', () => {
	let component: NavSecondaryItemComponent;
	let fixture: ComponentFixture<NavSecondaryItemComponent>;
	let router_spy: jasmine.SpyObj<Router>;

	beforeEach(async () => {
		router_spy = jasmine.createSpyObj('Router', ['navigate']);

		await TestBed.configureTestingModule({
			declarations: [NavSecondaryItemComponent],
			providers: [{provide: Router, useValue: router_spy}],
		}).compileComponents();

		fixture = TestBed.createComponent(NavSecondaryItemComponent);
		component = fixture.componentInstance;

		// Provide required inputs before detectChanges
		fixture.componentRef.setInput('name', 'Test Item');
		fixture.componentRef.setInput('navroute', '/test');

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
