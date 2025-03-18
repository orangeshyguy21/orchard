import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintIconComponent } from './mint-icon.component';

describe('MintIconComponent', () => {
  let component: MintIconComponent;
  let fixture: ComponentFixture<MintIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
