import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MintSubsectionConfigFormLimitHintComponent} from './mint-subsection-config-form-limit-hint.component';

describe('MintSubsectionConfigFormLimitHintComponent', () => {
	let component: MintSubsectionConfigFormLimitHintComponent;
	let fixture: ComponentFixture<MintSubsectionConfigFormLimitHintComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionConfigFormLimitHintComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionConfigFormLimitHintComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
