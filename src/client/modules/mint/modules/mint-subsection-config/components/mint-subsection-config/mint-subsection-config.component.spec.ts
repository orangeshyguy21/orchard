import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MintSubsectionConfigComponent} from './mint-subsection-config.component';

describe('MintSubsectionConfigComponent', () => {
	let component: MintSubsectionConfigComponent;
	let fixture: ComponentFixture<MintSubsectionConfigComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionConfigComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionConfigComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
