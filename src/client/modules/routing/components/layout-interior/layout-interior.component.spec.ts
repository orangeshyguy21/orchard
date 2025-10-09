/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideLuxonDateAdapter} from '@angular/material-luxon-adapter';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {RouterOutlet, provideRouter} from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
/* Vendor Dependencies */
import {MatIconTestingModule} from '@angular/material/icon/testing';
/* Native Dependencies */
import {OrcRoutingModule} from '@client/modules/routing/routing.module';
/* Local Dependencies */
import {LayoutInteriorComponent} from './layout-interior.component';

describe('LayoutInteriorComponent', () => {
	let component: LayoutInteriorComponent;
	let fixture: ComponentFixture<LayoutInteriorComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MatSidenavModule, OrcRoutingModule, RouterOutlet, MatIconTestingModule],
			declarations: [LayoutInteriorComponent],
			providers: [provideLuxonDateAdapter(), provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
		}).compileComponents();

		fixture = TestBed.createComponent(LayoutInteriorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
