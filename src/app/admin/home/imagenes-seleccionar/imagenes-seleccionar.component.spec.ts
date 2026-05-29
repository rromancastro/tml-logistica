import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagenesSeleccionarComponent } from './imagenes-seleccionar.component';

describe('ImagenesSeleccionarComponent', () => {
  let component: ImagenesSeleccionarComponent;
  let fixture: ComponentFixture<ImagenesSeleccionarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagenesSeleccionarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImagenesSeleccionarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
