/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
/* Vendor Dependencies */
import {MatCardModule} from '@angular/material/card';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatIconModule} from '@angular/material/icon';
import {MatRippleModule} from '@angular/material/core';
/* Application Dependencies */
import {FormModule} from '@client/modules/form/form.module';
import {MintAppModule} from '@client/modules/mint/mint.app.module';
/* Local Dependencies */
import {MintConfigFormSupportedComponent} from './mint-config-form-supported.component';

describe('MintConfigFormSupportedComponent', () => {
	let component: MintConfigFormSupportedComponent;
	let fixture: ComponentFixture<MintConfigFormSupportedComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintConfigFormSupportedComponent],
			imports: [CommonModule, MatCardModule, MatSlideToggleModule, MatIconModule, MatRippleModule, FormModule, MintAppModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintConfigFormSupportedComponent);
		component = fixture.componentInstance;
		component.supported = false;
		component.nut_index = 'NUT-01';
		component.nut_icon = 'bolt';
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
