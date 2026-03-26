import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioBeneficios } from './inicio-beneficios';

describe('InicioBeneficios', () => {
  let component: InicioBeneficios;
  let fixture: ComponentFixture<InicioBeneficios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioBeneficios],
    }).compileComponents();

    fixture = TestBed.createComponent(InicioBeneficios);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
