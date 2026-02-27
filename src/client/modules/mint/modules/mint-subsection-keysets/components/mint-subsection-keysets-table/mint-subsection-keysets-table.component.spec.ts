/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcMintSubsectionKeysetsModule} from '@client/modules/mint/modules/mint-subsection-keysets/mint-subsection-keysets.module';
/* Local Dependencies */
import {MintSubsectionKeysetsTableComponent} from './mint-subsection-keysets-table.component';

describe('MintSubsectionKeysetsTableComponent', () => {
	let component: MintSubsectionKeysetsTableComponent;
	let fixture: ComponentFixture<MintSubsectionKeysetsTableComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionKeysetsModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionKeysetsTableComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('keysets', []);
		fixture.componentRef.setInput('keysets_analytics', []);
		fixture.componentRef.setInput('keysets_analytics_pre', []);
		fixture.componentRef.setInput('keysets_counts', []);
		fixture.componentRef.setInput('page_settings', {date_end: 0, status: [], units: []});
		fixture.componentRef.setInput('loading', true);
		fixture.componentRef.setInput('device_type', 'desktop');
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
