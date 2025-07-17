import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MintDataBackupRestoreComponent} from './mint-data-backup-restore.component';

describe('MintDataBackupRestoreComponent', () => {
	let component: MintDataBackupRestoreComponent;
	let fixture: ComponentFixture<MintDataBackupRestoreComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintDataBackupRestoreComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintDataBackupRestoreComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
