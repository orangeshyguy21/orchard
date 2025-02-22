import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintConfigComponent } from './mint-config.component';

describe('MintConfigComponent', () => {
  let component: MintConfigComponent;
  let fixture: ComponentFixture<MintConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
