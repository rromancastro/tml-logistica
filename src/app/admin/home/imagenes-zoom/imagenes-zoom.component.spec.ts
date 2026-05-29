import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagenesZoomComponent } from './imagenes-zoom.component';

describe('ImagenesZoomComponent', () => {
  let component: ImagenesZoomComponent;
  let fixture: ComponentFixture<ImagenesZoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagenesZoomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImagenesZoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
