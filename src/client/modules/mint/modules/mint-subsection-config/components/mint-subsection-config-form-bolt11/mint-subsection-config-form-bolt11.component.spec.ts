/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSubsectionConfigFormBolt11Component} from './mint-subsection-config-form-bolt11.component';

describe('MintSubsectionConfigFormBolt11Component', () => {
	let component: MintSubsectionConfigFormBolt11Component;
	let fixture: ComponentFixture<MintSubsectionConfigFormBolt11Component>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionConfigFormBolt11Component],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionConfigFormBolt11Component);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
