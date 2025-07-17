import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MintConnectionsComponent} from './mint-connections.component';

describe('MintConnectionsComponent', () => {
	let component: MintConnectionsComponent;
	let fixture: ComponentFixture<MintConnectionsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintConnectionsComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintConnectionsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
