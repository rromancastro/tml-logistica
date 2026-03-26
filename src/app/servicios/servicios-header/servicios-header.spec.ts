import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosHeader } from './servicios-header';

describe('ServiciosHeader', () => {
  let component: ServiciosHeader;
  let fixture: ComponentFixture<ServiciosHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiciosHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiciosHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
