/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSubsectionConfigNut19Component} from './mint-subsection-config-nut19.component';

describe('MintSubsectionConfigNut19Component', () => {
	let component: MintSubsectionConfigNut19Component;
	let fixture: ComponentFixture<MintSubsectionConfigNut19Component>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionConfigNut19Component],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionConfigNut19Component);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
