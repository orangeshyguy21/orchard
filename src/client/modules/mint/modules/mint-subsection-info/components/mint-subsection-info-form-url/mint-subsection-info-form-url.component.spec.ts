/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSubsectionInfoFormUrlComponent} from './mint-subsection-info-form-url.component';

describe('MintSubsectionInfoFormUrlComponent', () => {
	let component: MintSubsectionInfoFormUrlComponent;
	let fixture: ComponentFixture<MintSubsectionInfoFormUrlComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionInfoFormUrlComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionInfoFormUrlComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
