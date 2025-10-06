/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSubsectionConfigFormQuoteTtlComponent} from './mint-subsection-config-form-quote-ttl.component';

describe('MintSubsectionConfigFormQuoteTtlComponent', () => {
	let component: MintSubsectionConfigFormQuoteTtlComponent;
	let fixture: ComponentFixture<MintSubsectionConfigFormQuoteTtlComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionConfigFormQuoteTtlComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionConfigFormQuoteTtlComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
