import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { enabledGuard } from './enabled.guard';

describe('enabledGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => enabledGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
