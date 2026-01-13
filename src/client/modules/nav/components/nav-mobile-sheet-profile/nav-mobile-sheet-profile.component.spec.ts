/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
/* Vendor Dependencies */
import {MatBottomSheetRef} from '@angular/material/bottom-sheet';
/* Native Dependencies */
import {OrcNavModule} from '@client/modules/nav/nav.module';
/* Local Dependencies */
import {NavMobileSheetProfileComponent} from './nav-mobile-sheet-profile.component';

describe('NavMobileSheetProfileComponent', () => {
	let component: NavMobileSheetProfileComponent;
	let fixture: ComponentFixture<NavMobileSheetProfileComponent>;

	beforeEach(async () => {
		const mock_bottom_sheet_ref = {
			dismiss: jasmine.createSpy('dismiss'),
		};

		await TestBed.configureTestingModule({
			imports: [OrcNavModule],
			providers: [provideRouter([]), {provide: MatBottomSheetRef, useValue: mock_bottom_sheet_ref}],
		}).compileComponents();

		fixture = TestBed.createComponent(NavMobileSheetProfileComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
