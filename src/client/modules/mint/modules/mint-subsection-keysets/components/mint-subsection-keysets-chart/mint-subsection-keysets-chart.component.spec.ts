/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Vendor Dependencies */
import {provideLuxonDateAdapter} from '@angular/material-luxon-adapter';
/* Native Dependencies */
import {OrcMintSubsectionKeysetsModule} from '@client/modules/mint/modules/mint-subsection-keysets/mint-subsection-keysets.module';
/* Local Dependencies */
import {MintSubsectionKeysetsChartComponent} from './mint-subsection-keysets-chart.component';

describe('MintSubsectionKeysetsChartComponent', () => {
	let component: MintSubsectionKeysetsChartComponent;
	let fixture: ComponentFixture<MintSubsectionKeysetsChartComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionKeysetsModule],
			providers: [provideLuxonDateAdapter()],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionKeysetsChartComponent);
		component = fixture.componentInstance;
		component.loading = true; // avoid init path
		(component as any).keysets_analytics = [];
		(component as any).keysets_analytics_pre = [];
		(component as any).chart_type = 'line';
		(component as any).chart_data = {datasets: []};
		(component as any).chart_options = {};
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
