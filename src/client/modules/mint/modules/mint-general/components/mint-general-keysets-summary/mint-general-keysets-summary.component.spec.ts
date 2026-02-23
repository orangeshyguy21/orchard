/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcMintGeneralModule} from '@client/modules/mint/modules/mint-general/mint-general.module';
/* Local Dependencies */
import {MintGeneralKeysetsSummaryComponent} from './mint-general-keysets-summary.component';

describe('MintGeneralKeysetsSummaryComponent', () => {
	let component: MintGeneralKeysetsSummaryComponent;
	let fixture: ComponentFixture<MintGeneralKeysetsSummaryComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintGeneralModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintGeneralKeysetsSummaryComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('loading', false);
		fixture.componentRef.setInput('keysets', []);
		fixture.componentRef.setInput('proof_counts', []);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
