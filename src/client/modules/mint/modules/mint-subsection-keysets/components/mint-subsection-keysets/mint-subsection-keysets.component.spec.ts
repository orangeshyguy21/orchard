/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute} from '@angular/router';
/* Vendor Dependencies */
import {of} from 'rxjs';
/* Native Dependencies */
import {OrcMintSubsectionKeysetsModule} from '@client/modules/mint/modules/mint-subsection-keysets/mint-subsection-keysets.module';
import {MintService} from '@client/modules/mint/services/mint/mint.service';
/* Local Dependencies */
import {MintSubsectionKeysetsComponent} from './mint-subsection-keysets.component';

describe('MintSubsectionKeysetsComponent', () => {
	let component: MintSubsectionKeysetsComponent;
	let fixture: ComponentFixture<MintSubsectionKeysetsComponent>;

	beforeEach(async () => {
		const mint_service_stub = {
			loadMintAnalyticsKeysets: () => of([]),
			loadMintKeysetProofCounts: () => of([]),
		};
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionKeysetsModule],
			providers: [
				{
					provide: ActivatedRoute,
					useValue: {
						snapshot: {
							data: {
								mint_keysets: [
									{
										id: 'k1',
										unit: 'sat',
										active: true,
										valid_from: 1,
										input_fee_ppk: 1000,
									},
								],
							},
						},
					},
				},
				{provide: MintService, useValue: mint_service_stub},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionKeysetsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
