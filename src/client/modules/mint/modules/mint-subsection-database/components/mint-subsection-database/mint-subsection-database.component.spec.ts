/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute} from '@angular/router';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
/* Vendor Dependencies */
import {provideLuxonDateAdapter} from '@angular/material-luxon-adapter';
/* Native Dependencies */
import {OrcMintSubsectionDatabaseModule} from '@client/modules/mint/modules/mint-subsection-database/mint-subsection-database.module';
/* Local Dependencies */
import {MintSubsectionDatabaseComponent} from './mint-subsection-database.component';

describe('MintSubsectionDatabaseComponent', () => {
	let component: MintSubsectionDatabaseComponent;
	let fixture: ComponentFixture<MintSubsectionDatabaseComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionDatabaseModule],
			declarations: [MintSubsectionDatabaseComponent],
			providers: [
				provideLuxonDateAdapter(),
				provideHttpClient(),
				provideHttpClientTesting(),
				{provide: ActivatedRoute, useValue: {snapshot: {data: {mint_keysets: []}}}},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionDatabaseComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
