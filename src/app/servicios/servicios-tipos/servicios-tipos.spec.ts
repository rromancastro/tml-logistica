import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosTipos } from './servicios-tipos';

describe('ServiciosTipos', () => {
  let component: ServiciosTipos;
  let fixture: ComponentFixture<ServiciosTipos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiciosTipos],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiciosTipos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
