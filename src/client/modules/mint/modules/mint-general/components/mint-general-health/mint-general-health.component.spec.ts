/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcMintGeneralModule} from '@client/modules/mint/modules/mint-general/mint-general.module';
/* Local Dependencies */
import {MintGeneralHealthComponent} from './mint-general-health.component';

describe('MintGeneralHealthComponent', () => {
	let component: MintGeneralHealthComponent;
	let fixture: ComponentFixture<MintGeneralHealthComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintGeneralModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintGeneralHealthComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('loading', false);
		fixture.componentRef.setInput('pulse', null);
		fixture.componentRef.setInput('sparkline_data', []);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
