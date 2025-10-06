/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSubsectionKeysetsFormComponent} from './mint-subsection-keysets-form.component';

describe('MintSubsectionKeysetsFormComponent', () => {
	let component: MintSubsectionKeysetsFormComponent;
	let fixture: ComponentFixture<MintSubsectionKeysetsFormComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionKeysetsFormComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionKeysetsFormComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
