import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintGeneralKeysetsComponent } from './mint-general-keysets.component';

describe('MintGeneralKeysetsComponent', () => {
  let component: MintGeneralKeysetsComponent;
  let fixture: ComponentFixture<MintGeneralKeysetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintGeneralKeysetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintGeneralKeysetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
