/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcMintGeneralModule} from '@client/modules/mint/modules/mint-general/mint-general.module';
/* Local Dependencies */
import {MintGeneralIconComponent} from './mint-general-icon.component';

describe('MintGeneralIconComponent', () => {
	let component: MintGeneralIconComponent;
	let fixture: ComponentFixture<MintGeneralIconComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintGeneralModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintGeneralIconComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('icon_data', null);
		fixture.componentRef.setInput('loading', false);
		fixture.componentRef.setInput('error', true);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
