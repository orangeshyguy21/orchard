/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcMintGeneralModule} from '@client/modules/mint/modules/mint-general/mint-general.module';
/* Local Dependencies */
import {MintGeneralConfigComponent} from './mint-general-config.component';

describe('MintGeneralConfigComponent', () => {
	let component: MintGeneralConfigComponent;
	let fixture: ComponentFixture<MintGeneralConfigComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintGeneralModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintGeneralConfigComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('info', null);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
