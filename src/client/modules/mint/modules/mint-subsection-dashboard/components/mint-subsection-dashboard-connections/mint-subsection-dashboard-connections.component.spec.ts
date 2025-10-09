/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {MatIconTestingModule} from '@angular/material/icon/testing';
import {OrcMintSubsectionDashboardModule} from '@client/modules/mint/modules/mint-subsection-dashboard/mint-subsection-dashboard.module';
/* Local Dependencies */
import {MintSubsectionDashboardConnectionsComponent} from './mint-subsection-dashboard-connections.component';

describe('MintSubsectionDashboardConnectionsComponent', () => {
	let component: MintSubsectionDashboardConnectionsComponent;
	let fixture: ComponentFixture<MintSubsectionDashboardConnectionsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionDashboardModule, MatIconTestingModule],
			declarations: [MintSubsectionDashboardConnectionsComponent],
			providers: [provideHttpClient(), provideHttpClientTesting()],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionDashboardConnectionsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
