import { TestBed } from '@angular/core/testing';

import { GraphicService } from './graphic.service';

describe('GraphicService', () => {
  let service: GraphicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
