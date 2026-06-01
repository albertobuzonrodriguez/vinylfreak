import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViniloDetalle } from './vinilo-detalle';

describe('ViniloDetalle', () => {
  let component: ViniloDetalle;
  let fixture: ComponentFixture<ViniloDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViniloDetalle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViniloDetalle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
