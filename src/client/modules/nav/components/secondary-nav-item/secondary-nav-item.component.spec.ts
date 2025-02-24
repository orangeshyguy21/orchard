import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryNavItemComponent } from './secondary-nav-item.component';

describe('SecondaryNavItemComponent', () => {
  let component: SecondaryNavItemComponent;
  let fixture: ComponentFixture<SecondaryNavItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SecondaryNavItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondaryNavItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
