/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSubsectionConfigFormEnabledComponent} from './mint-subsection-config-form-enabled.component';

describe('MintSubsectionConfigFormEnabledComponent', () => {
	let component: MintSubsectionConfigFormEnabledComponent;
	let fixture: ComponentFixture<MintSubsectionConfigFormEnabledComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionConfigFormEnabledComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionConfigFormEnabledComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
