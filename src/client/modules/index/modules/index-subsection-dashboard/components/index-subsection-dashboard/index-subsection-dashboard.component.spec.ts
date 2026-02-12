/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
/* Vendor Dependencies */
import {MatIconTestingModule} from '@angular/material/icon/testing';
/* Native Dependencies */
import {OrcIndexSubsectionDashboardModule} from '@client/modules/index/modules/index-subsection-dashboard/index-subsection-dashboard.module';
/* Local Dependencies */
import {IndexSubsectionDashboardComponent} from './index-subsection-dashboard.component';

describe('IndexSubsectionDashboardComponent', () => {
	let component: IndexSubsectionDashboardComponent;
	let fixture: ComponentFixture<IndexSubsectionDashboardComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcIndexSubsectionDashboardModule, MatIconTestingModule],
			providers: [provideRouter([])],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionDashboardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
