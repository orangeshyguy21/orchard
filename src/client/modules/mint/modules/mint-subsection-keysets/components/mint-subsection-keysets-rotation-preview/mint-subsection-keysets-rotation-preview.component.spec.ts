/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSubsectionKeysetsRotationPreviewComponent} from './mint-subsection-keysets-rotation-preview.component';

describe('MintSubsectionKeysetsRotationPreviewComponent', () => {
	let component: MintSubsectionKeysetsRotationPreviewComponent;
	let fixture: ComponentFixture<MintSubsectionKeysetsRotationPreviewComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionKeysetsRotationPreviewComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionKeysetsRotationPreviewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
