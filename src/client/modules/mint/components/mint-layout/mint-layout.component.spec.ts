import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintLayoutComponent } from './mint-layout.component';

describe('MintLayoutComponent', () => {
  let component: MintLayoutComponent;
  let fixture: ComponentFixture<MintLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
