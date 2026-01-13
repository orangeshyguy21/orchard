/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcMintSubsectionConfigModule} from '@client/modules/mint/modules/mint-subsection-config/mint-subsection-config.module';
/* Local Dependencies */
import {MintSubsectionConfigStatComponent} from './mint-subsection-config-stat.component';

describe('MintSubsectionConfigStatComponent', () => {
	let component: MintSubsectionConfigStatComponent;
	let fixture: ComponentFixture<MintSubsectionConfigStatComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionConfigModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionConfigStatComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('loading', true);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
