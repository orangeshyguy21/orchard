import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintBalanceSheetComponent } from './mint-balance-sheet.component';

describe('MintBalanceSheetComponent', () => {
  let component: MintBalanceSheetComponent;
  let fixture: ComponentFixture<MintBalanceSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintBalanceSheetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintBalanceSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
