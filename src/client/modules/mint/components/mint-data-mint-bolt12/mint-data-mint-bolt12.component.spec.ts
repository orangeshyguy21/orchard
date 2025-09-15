import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MintDataMintBolt12Component} from './mint-data-mint-bolt12.component';

describe('MintDataMintBolt12Component', () => {
	let component: MintDataMintBolt12Component;
	let fixture: ComponentFixture<MintDataMintBolt12Component>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintDataMintBolt12Component],
		}).compileComponents();

		fixture = TestBed.createComponent(MintDataMintBolt12Component);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
