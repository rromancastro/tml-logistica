import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideosSeleccionarComponent } from './videos-seleccionar.component';

describe('VideosSeleccionarComponent', () => {
  let component: VideosSeleccionarComponent;
  let fixture: ComponentFixture<VideosSeleccionarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideosSeleccionarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideosSeleccionarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
