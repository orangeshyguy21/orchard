/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSubsectionInfoFormNameComponent} from './mint-subsection-info-form-name.component';

describe('MintSubsectionInfoFormNameComponent', () => {
	let component: MintSubsectionInfoFormNameComponent;
	let fixture: ComponentFixture<MintSubsectionInfoFormNameComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionInfoFormNameComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionInfoFormNameComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
