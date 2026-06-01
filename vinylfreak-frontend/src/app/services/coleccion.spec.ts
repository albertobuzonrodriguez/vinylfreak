import { TestBed } from '@angular/core/testing';

import { Coleccion } from './coleccion';

describe('Coleccion', () => {
  let service: Coleccion;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Coleccion);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
