import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioTestimonios } from './inicio-testimonios';

describe('InicioTestimonios', () => {
  let component: InicioTestimonios;
  let fixture: ComponentFixture<InicioTestimonios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioTestimonios],
    }).compileComponents();

    fixture = TestBed.createComponent(InicioTestimonios);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
