/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Vendor Dependencies */
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
/* Native Dependencies */
import {OrcMintSubsectionDashboardModule} from '@client/modules/mint/modules/mint-subsection-dashboard/mint-subsection-dashboard.module';
/* Local Dependencies */
import {MintSubsectionDashboardConnectionDialogComponent} from './mint-subsection-dashboard-connection-dialog.component';

describe('MintSubsectionDashboardConnectionDialogComponent', () => {
	let component: MintSubsectionDashboardConnectionDialogComponent;
	let fixture: ComponentFixture<MintSubsectionDashboardConnectionDialogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionDashboardModule],
			declarations: [MintSubsectionDashboardConnectionDialogComponent],
			providers: [
				{provide: MatDialogRef, useValue: {close: jasmine.createSpy('close')}},
				{
					provide: MAT_DIALOG_DATA,
					useValue: {
						primary_color: '#000000',
						corner_dot_color: '#000000',
						icon_data: null,
						mint_name: 'Test Mint',
						connection: {url: 'https://example.com'},
					},
				},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionDashboardConnectionDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
