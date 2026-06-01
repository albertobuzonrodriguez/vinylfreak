import { TestBed } from '@angular/core/testing';

import { Vinilo } from './vinilo';

describe('Vinilo', () => {
  let service: Vinilo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Vinilo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
