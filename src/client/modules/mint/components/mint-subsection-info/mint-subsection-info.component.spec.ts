import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MintSubsectionInfoComponent} from './mint-subsection-info.component';

describe('MintSubsectionInfoComponent', () => {
	let component: MintSubsectionInfoComponent;
	let fixture: ComponentFixture<MintSubsectionInfoComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionInfoComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionInfoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
