/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcMintSubsectionConfigModule} from '@client/modules/mint/modules/mint-subsection-config/mint-subsection-config.module';
/* Local Dependencies */
import {MintSubsectionConfigNut17CommandsComponent} from './mint-subsection-config-nut17-commands.component';

describe('MintSubsectionConfigNut17CommandsComponent', () => {
	let component: MintSubsectionConfigNut17CommandsComponent;
	let fixture: ComponentFixture<MintSubsectionConfigNut17CommandsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionConfigModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionConfigNut17CommandsComponent);
		component = fixture.componentInstance;
		(component as any).nut17_commands = {unit: 'sat', methods: [{method: 'bolt11', commands: []}]} as any;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
