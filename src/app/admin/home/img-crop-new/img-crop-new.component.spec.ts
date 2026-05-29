import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgCropNewComponent } from './img-crop-new.component';

describe('ImgCropNewComponent', () => {
  let component: ImgCropNewComponent;
  let fixture: ComponentFixture<ImgCropNewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ImgCropNewComponent]
    });
    fixture = TestBed.createComponent(ImgCropNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
