import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MintSubsectionConfigFormQuoteTtlStatComponent} from './mint-subsection-config-form-quote-ttl-stat.component';

describe('MintSubsectionConfigFormQuoteTtlStatComponent', () => {
	let component: MintSubsectionConfigFormQuoteTtlStatComponent;
	let fixture: ComponentFixture<MintSubsectionConfigFormQuoteTtlStatComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionConfigFormQuoteTtlStatComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionConfigFormQuoteTtlStatComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
