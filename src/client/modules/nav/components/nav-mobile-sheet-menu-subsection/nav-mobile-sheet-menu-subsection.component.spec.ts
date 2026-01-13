/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Vendor Dependencies */
import {MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import {MatIconTestingModule} from '@angular/material/icon/testing';
/* Native Dependencies */
import {OrcNavModule} from '@client/modules/nav/nav.module';
/* Local Dependencies */
import {NavMobileSheetMenuSubsectionComponent} from './nav-mobile-sheet-menu-subsection.component';

describe('NavMobileSheetMenuSubsectionComponent', () => {
	let component: NavMobileSheetMenuSubsectionComponent;
	let fixture: ComponentFixture<NavMobileSheetMenuSubsectionComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MatIconTestingModule, OrcNavModule],
			providers: [
				{
					provide: MAT_BOTTOM_SHEET_DATA,
					useValue: {
						items: [],
						active_sub_section: '',
						enabled: false,
						online: false,
						syncing: false,
						icon: '',
						name: '',
					},
				},
				{
					provide: MatBottomSheetRef,
					useValue: {dismiss: () => {}},
				},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(NavMobileSheetMenuSubsectionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
