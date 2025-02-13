import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintComponent } from './mint.component';

describe('MintComponent', () => {
  let component: MintComponent;
  let fixture: ComponentFixture<MintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
