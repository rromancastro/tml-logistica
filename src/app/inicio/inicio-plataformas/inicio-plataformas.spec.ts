import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioPlataformas } from './inicio-plataformas';

describe('InicioPlataformas', () => {
  let component: InicioPlataformas;
  let fixture: ComponentFixture<InicioPlataformas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioPlataformas],
    }).compileComponents();

    fixture = TestBed.createComponent(InicioPlataformas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
