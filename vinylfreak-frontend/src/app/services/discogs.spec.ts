import { TestBed } from '@angular/core/testing';

import { Discogs } from './discogs';

describe('Discogs', () => {
  let service: Discogs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Discogs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
