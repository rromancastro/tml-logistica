import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionDeArchivosComponent } from './seleccion-de-archivos.component';

describe('SeleccionDeArchivosComponent', () => {
  let component: SeleccionDeArchivosComponent;
  let fixture: ComponentFixture<SeleccionDeArchivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeleccionDeArchivosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeleccionDeArchivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
