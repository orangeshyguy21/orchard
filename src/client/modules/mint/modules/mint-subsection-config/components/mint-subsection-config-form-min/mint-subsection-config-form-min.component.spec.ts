/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSubsectionConfigFormMinComponent} from './mint-subsection-config-form-min.component';

describe('MintSubsectionConfigFormMinComponent', () => {
	let component: MintSubsectionConfigFormMinComponent;
	let fixture: ComponentFixture<MintSubsectionConfigFormMinComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionConfigFormMinComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionConfigFormMinComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
