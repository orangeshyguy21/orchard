import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintNutComponent } from './mint-nut.component';

describe('MintNutComponent', () => {
  let component: MintNutComponent;
  let fixture: ComponentFixture<MintNutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintNutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintNutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
