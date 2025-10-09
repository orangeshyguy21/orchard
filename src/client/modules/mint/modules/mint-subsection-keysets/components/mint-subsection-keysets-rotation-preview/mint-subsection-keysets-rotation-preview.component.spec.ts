/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcMintSubsectionKeysetsModule} from '@client/modules/mint/modules/mint-subsection-keysets/mint-subsection-keysets.module';
/* Vendor Dependencies */
import {provideLuxonDateAdapter} from '@angular/material-luxon-adapter';
/* Local Dependencies */
import {MintSubsectionKeysetsRotationPreviewComponent} from './mint-subsection-keysets-rotation-preview.component';

describe('MintSubsectionKeysetsRotationPreviewComponent', () => {
	let component: MintSubsectionKeysetsRotationPreviewComponent;
	let fixture: ComponentFixture<MintSubsectionKeysetsRotationPreviewComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionKeysetsModule],
			providers: [provideLuxonDateAdapter()],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionKeysetsRotationPreviewComponent);
		component = fixture.componentInstance;
		component.keyset_in_unit = 'sat' as any;
		component.keyset_in_index = 1;
		component.keyset_in_fee = 0;
		component.keyset_out_unit = 'sat' as any;
		component.keyset_out_index = 0;
		component.keyset_out_fee = 0;
		component.keyset_out_balance = 0;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
