import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintConnectionStatusComponent } from './mint-connection-status.component';

describe('MintConnectionStatusComponent', () => {
  let component: MintConnectionStatusComponent;
  let fixture: ComponentFixture<MintConnectionStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintConnectionStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintConnectionStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
