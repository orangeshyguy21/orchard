import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintNavComponent } from './mint-nav.component';

describe('MintNavComponent', () => {
  let component: MintNavComponent;
  let fixture: ComponentFixture<MintNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
