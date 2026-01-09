import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MintSubsectionConfigFormQuoteTtlHintComponent} from './mint-subsection-config-form-quote-ttl-hint.component';

describe('MintSubsectionConfigFormQuoteTtlHintComponent', () => {
	let component: MintSubsectionConfigFormQuoteTtlHintComponent;
	let fixture: ComponentFixture<MintSubsectionConfigFormQuoteTtlHintComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionConfigFormQuoteTtlHintComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionConfigFormQuoteTtlHintComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
