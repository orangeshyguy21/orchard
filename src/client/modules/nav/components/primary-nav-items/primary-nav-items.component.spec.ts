/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Vendor Dependencies */
import {MatIconTestingModule} from '@angular/material/icon/testing';
/* Native Dependencies */
import {OrcNavModule} from '@client/modules/nav/nav.module';
/* Local Dependencies */
import {PrimaryNavItemsComponent} from './primary-nav-items.component';

describe('PrimaryNavItemsComponent', () => {
	let component: PrimaryNavItemsComponent;
	let fixture: ComponentFixture<PrimaryNavItemsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MatIconTestingModule, OrcNavModule],
		}).compileComponents();

		fixture = TestBed.createComponent(PrimaryNavItemsComponent);
		component = fixture.componentInstance;
		component.active_section = '';
		component.enabled_bitcoin = false;
		component.enabled_lightning = false;
		component.enabled_mint = false;
		component.online_bitcoin = false;
		component.online_lightning = false;
		component.online_mint = false;
		component.syncing_bitcoin = false;
		component.syncing_lightning = false;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
