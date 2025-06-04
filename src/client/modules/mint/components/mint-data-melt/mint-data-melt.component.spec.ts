import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintDataMeltComponent } from './mint-data-melt.component';

describe('MintDataMeltComponent', () => {
  let component: MintDataMeltComponent;
  let fixture: ComponentFixture<MintDataMeltComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintDataMeltComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintDataMeltComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
