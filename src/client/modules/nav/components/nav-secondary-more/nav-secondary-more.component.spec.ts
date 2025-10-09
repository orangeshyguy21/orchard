/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
/* Vendor Dependencies */
import {MatIconTestingModule} from '@angular/material/icon/testing';
import {of} from 'rxjs';
/* Native Dependencies */
import {OrcNavModule} from '@client/modules/nav/nav.module';
import {AuthService} from '@client/modules/auth/services/auth/auth.service';
/* Local Dependencies */
import {NavSecondaryMoreComponent} from './nav-secondary-more.component';

describe('NavSecondaryMoreComponent', () => {
	let component: NavSecondaryMoreComponent;
	let fixture: ComponentFixture<NavSecondaryMoreComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MatIconTestingModule, OrcNavModule],
			declarations: [NavSecondaryMoreComponent],
			providers: [provideRouter([]), {provide: AuthService, useValue: {revokeToken: () => of(true)}}],
		}).compileComponents();

		fixture = TestBed.createComponent(NavSecondaryMoreComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
