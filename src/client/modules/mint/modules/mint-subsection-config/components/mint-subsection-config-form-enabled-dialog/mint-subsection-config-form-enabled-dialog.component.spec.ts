/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSubsectionConfigFormEnabledDialogComponent} from './mint-subsection-config-form-enabled-dialog.component';

describe('MintSubsectionConfigFormEnabledDialogComponent', () => {
	let component: MintSubsectionConfigFormEnabledDialogComponent;
	let fixture: ComponentFixture<MintSubsectionConfigFormEnabledDialogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionConfigFormEnabledDialogComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionConfigFormEnabledDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
