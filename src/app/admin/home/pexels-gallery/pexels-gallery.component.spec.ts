import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PexelsGalleryComponent } from './pexels-gallery.component';

describe('PexelsGalleryComponent', () => {
  let component: PexelsGalleryComponent;
  let fixture: ComponentFixture<PexelsGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PexelsGalleryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PexelsGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
