import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintBalanceSheetTableComponent } from './mint-balance-sheet-table.component';

describe('MintBalanceTableComponent', () => {
  let component: MintBalanceSheetTableComponent;
  let fixture: ComponentFixture<MintBalanceSheetTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintBalanceSheetTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintBalanceSheetTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
