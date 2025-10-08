import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSubsectionConfigNut15MethodComponent} from './mint-subsection-config-nut15-method.component';

describe('MintSubsectionConfigNut15MethodComponent', () => {
	let component: MintSubsectionConfigNut15MethodComponent;
	let fixture: ComponentFixture<MintSubsectionConfigNut15MethodComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionConfigNut15MethodComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionConfigNut15MethodComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
