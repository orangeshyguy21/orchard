/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSubsectionInfoFormUrlsComponent} from './mint-subsection-info-form-urls.component';

describe('MintSubsectionInfoFormUrlsComponent', () => {
	let component: MintSubsectionInfoFormUrlsComponent;
	let fixture: ComponentFixture<MintSubsectionInfoFormUrlsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionInfoFormUrlsComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionInfoFormUrlsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
