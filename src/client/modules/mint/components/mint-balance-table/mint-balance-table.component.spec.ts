import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintBalanceTableComponent } from './mint-balance-table.component';

describe('MintBalanceTableComponent', () => {
  let component: MintBalanceTableComponent;
  let fixture: ComponentFixture<MintBalanceTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintBalanceTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintBalanceTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
