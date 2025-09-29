/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Vendor Dependencies */
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatIconModule} from '@angular/material/icon';
import {MatNativeDateModule} from '@angular/material/core';
/* Application Dependencies */
import {GraphicModule} from '@client/modules/graphic/graphic.module';
import {LocalModule} from '@client/modules/local/local.module';
import {MintModule} from '@client/modules/mint/mint.module';
/* Local Dependencies */
import {MintKeysetTableComponent} from './mint-keyset-table.component';

describe('MintKeysetTableComponent', () => {
	let component: MintKeysetTableComponent;
	let fixture: ComponentFixture<MintKeysetTableComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintKeysetTableComponent],
			imports: [
				// Angular Material used in the template
				MatCardModule,
				MatTableModule,
				MatSortModule,
				MatIconModule,
				MatNativeDateModule,
				// Feature modules for custom components and pipes
				GraphicModule,
				MintModule,
				LocalModule,
			],
		}).compileComponents();

		fixture = TestBed.createComponent(MintKeysetTableComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
