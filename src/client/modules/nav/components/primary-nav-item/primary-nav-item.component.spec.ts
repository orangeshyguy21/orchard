import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryNavItemComponent } from './primary-nav-item.component';

describe('PrimaryNavItemComponent', () => {
  let component: PrimaryNavItemComponent;
  let fixture: ComponentFixture<PrimaryNavItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrimaryNavItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrimaryNavItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
