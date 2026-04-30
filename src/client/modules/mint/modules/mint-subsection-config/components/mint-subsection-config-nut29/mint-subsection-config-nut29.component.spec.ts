/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcMintSubsectionConfigModule} from '@client/modules/mint/modules/mint-subsection-config/mint-subsection-config.module';
/* Local Dependencies */
import {MintSubsectionConfigNut29Component} from './mint-subsection-config-nut29.component';

describe('MintSubsectionConfigNut29Component', () => {
	let component: MintSubsectionConfigNut29Component;
	let fixture: ComponentFixture<MintSubsectionConfigNut29Component>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionConfigModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionConfigNut29Component);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('nut29', {max_batch_size: 0, methods: []});
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
