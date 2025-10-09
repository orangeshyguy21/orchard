/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute} from '@angular/router';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
/* Vendor Dependencies */
import {provideLuxonDateAdapter} from '@angular/material-luxon-adapter';
import {MatIconTestingModule} from '@angular/material/icon/testing';
/* Native Dependencies */
import {OrcMintSubsectionDashboardModule} from '@client/modules/mint/modules/mint-subsection-dashboard/mint-subsection-dashboard.module';
/* Local Dependencies */
import {MintSubsectionDashboardComponent} from './mint-subsection-dashboard.component';

describe('MintSubsectionDashboardComponent', () => {
	let component: MintSubsectionDashboardComponent;
	let fixture: ComponentFixture<MintSubsectionDashboardComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionDashboardModule, MatIconTestingModule],
			declarations: [MintSubsectionDashboardComponent],
			providers: [
				provideLuxonDateAdapter(),
				provideHttpClient(),
				provideHttpClientTesting(),
				{provide: ActivatedRoute, useValue: {snapshot: {data: {mint_info: null, mint_balances: [], mint_keysets: []}}}},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionDashboardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
