import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosTrazabilidad } from './servicios-trazabilidad';

describe('ServiciosTrazabilidad', () => {
  let component: ServiciosTrazabilidad;
  let fixture: ComponentFixture<ServiciosTrazabilidad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiciosTrazabilidad],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiciosTrazabilidad);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
