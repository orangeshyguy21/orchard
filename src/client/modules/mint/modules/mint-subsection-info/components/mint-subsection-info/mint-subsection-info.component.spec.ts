/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute} from '@angular/router';
/* Native Dependencies */
import {OrcMintSubsectionInfoModule} from '@client/modules/mint/modules/mint-subsection-info/mint-subsection-info.module';
/* Local Dependencies */
import {MintSubsectionInfoComponent} from './mint-subsection-info.component';

describe('MintSubsectionInfoComponent', () => {
	let component: MintSubsectionInfoComponent;
	let fixture: ComponentFixture<MintSubsectionInfoComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionInfoModule],
			providers: [{provide: ActivatedRoute, useValue: {snapshot: {data: {mint_info_rpc: {urls: [], contact: []}}}}}],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionInfoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
