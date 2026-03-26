import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioServicios } from './inicio-servicios';

describe('InicioServicios', () => {
  let component: InicioServicios;
  let fixture: ComponentFixture<InicioServicios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioServicios],
    }).compileComponents();

    fixture = TestBed.createComponent(InicioServicios);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
