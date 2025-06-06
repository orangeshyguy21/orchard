import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintDataTableComponent } from './mint-data-table.component';

describe('MintDataTableComponent', () => {
  let component: MintDataTableComponent;
  let fixture: ComponentFixture<MintDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintDataTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
