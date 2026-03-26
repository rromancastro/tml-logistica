import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioClientes } from './inicio-clientes';

describe('InicioClientes', () => {
  let component: InicioClientes;
  let fixture: ComponentFixture<InicioClientes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioClientes],
    }).compileComponents();

    fixture = TestBed.createComponent(InicioClientes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
