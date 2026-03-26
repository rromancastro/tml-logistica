import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioFormulario } from './inicio-formulario';

describe('InicioFormulario', () => {
  let component: InicioFormulario;
  let fixture: ComponentFixture<InicioFormulario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioFormulario],
    }).compileComponents();

    fixture = TestBed.createComponent(InicioFormulario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
