/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSubsectionConfigNut17CommandsComponent} from './mint-subsection-config-nut17-commands.component';

describe('MintSubsectionConfigNut17CommandsComponent', () => {
	let component: MintSubsectionConfigNut17CommandsComponent;
	let fixture: ComponentFixture<MintSubsectionConfigNut17CommandsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionConfigNut17CommandsComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionConfigNut17CommandsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
