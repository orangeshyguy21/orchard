import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintDataEcashComponent } from './mint-data-ecash.component';

describe('MintDataEcashComponent', () => {
  let component: MintDataEcashComponent;
  let fixture: ComponentFixture<MintDataEcashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintDataEcashComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintDataEcashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
