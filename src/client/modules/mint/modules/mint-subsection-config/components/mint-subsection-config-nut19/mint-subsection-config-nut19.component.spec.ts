/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcMintSubsectionConfigModule} from '@client/modules/mint/modules/mint-subsection-config/mint-subsection-config.module';
/* Local Dependencies */
import {MintSubsectionConfigNut19Component} from './mint-subsection-config-nut19.component';

describe('MintSubsectionConfigNut19Component', () => {
	let component: MintSubsectionConfigNut19Component;
	let fixture: ComponentFixture<MintSubsectionConfigNut19Component>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionConfigModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionConfigNut19Component);
		component = fixture.componentInstance;
		(component as any).nut19 = {ttl: 0, cached_endpoints: []} as any;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
