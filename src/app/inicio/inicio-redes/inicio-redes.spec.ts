import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioRedes } from './inicio-redes';

describe('InicioRedes', () => {
  let component: InicioRedes;
  let fixture: ComponentFixture<InicioRedes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioRedes],
    }).compileComponents();

    fixture = TestBed.createComponent(InicioRedes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
