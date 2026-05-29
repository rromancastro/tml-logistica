import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PexelsVideoGalleryComponent } from './pexels-video-gallery.component';

describe('PexelsVideoGalleryComponent', () => {
  let component: PexelsVideoGalleryComponent;
  let fixture: ComponentFixture<PexelsVideoGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PexelsVideoGalleryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PexelsVideoGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
