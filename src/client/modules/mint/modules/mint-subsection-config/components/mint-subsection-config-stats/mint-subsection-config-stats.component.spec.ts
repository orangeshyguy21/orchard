/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcMintSubsectionConfigModule} from '@client/modules/mint/modules/mint-subsection-config/mint-subsection-config.module';
/* Local Dependencies */
import {MintSubsectionConfigStatsComponent} from './mint-subsection-config-stats.component';

describe('MintSubsectionConfigStatsComponent', () => {
	let component: MintSubsectionConfigStatsComponent;
	let fixture: ComponentFixture<MintSubsectionConfigStatsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionConfigModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionConfigStatsComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('loading', true);
		fixture.componentRef.setInput('stats', {mint_quotes: 0, melt_quotes: 0, tokens: 0, proofs: 0});
		fixture.componentRef.setInput('unit', 'sat');
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
