import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivosSeleccionarComponent } from './archivos-seleccionar.component';

describe('ArchivosSeleccionarComponent', () => {
  let component: ArchivosSeleccionarComponent;
  let fixture: ComponentFixture<ArchivosSeleccionarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchivosSeleccionarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchivosSeleccionarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
