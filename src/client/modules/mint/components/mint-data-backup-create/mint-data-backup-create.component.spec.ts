import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintDataBackupCreateComponent } from './mint-data-backup-create.component';

describe('MintDataBackupCreateComponent', () => {
  let component: MintDataBackupCreateComponent;
  let fixture: ComponentFixture<MintDataBackupCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintDataBackupCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintDataBackupCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
