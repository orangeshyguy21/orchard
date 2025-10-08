/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSubsectionConfigFormMaxComponent} from './mint-subsection-config-form-max.component';

describe('MintSubsectionConfigFormMaxComponent', () => {
	let component: MintSubsectionConfigFormMaxComponent;
	let fixture: ComponentFixture<MintSubsectionConfigFormMaxComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionConfigFormMaxComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionConfigFormMaxComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
