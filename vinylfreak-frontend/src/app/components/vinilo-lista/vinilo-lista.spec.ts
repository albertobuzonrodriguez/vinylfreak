import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViniloLista } from './vinilo-lista';

describe('ViniloLista', () => {
  let component: ViniloLista;
  let fixture: ComponentFixture<ViniloLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViniloLista]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViniloLista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
