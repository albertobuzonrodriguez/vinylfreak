import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscadorUsuarios } from './buscador-usuarios';

describe('BuscadorUsuarios', () => {
  let component: BuscadorUsuarios;
  let fixture: ComponentFixture<BuscadorUsuarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuscadorUsuarios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscadorUsuarios);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
