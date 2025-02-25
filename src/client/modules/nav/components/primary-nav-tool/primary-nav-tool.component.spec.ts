import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryNavToolComponent } from './primary-nav-tool.component';

describe('PrimaryNavToolComponent', () => {
  let component: PrimaryNavToolComponent;
  let fixture: ComponentFixture<PrimaryNavToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrimaryNavToolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrimaryNavToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
