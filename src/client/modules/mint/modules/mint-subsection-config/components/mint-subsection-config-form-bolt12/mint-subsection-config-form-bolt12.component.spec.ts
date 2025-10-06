/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSubsectionConfigFormBolt12Component} from './mint-subsection-config-form-bolt12.component';

describe('MintSubsectionConfigFormBolt12Component', () => {
	let component: MintSubsectionConfigFormBolt12Component;
	let fixture: ComponentFixture<MintSubsectionConfigFormBolt12Component>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionConfigFormBolt12Component],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionConfigFormBolt12Component);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
