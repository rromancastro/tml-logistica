import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideosSubirComponent } from './videos-subir.component';

describe('VideosSubirComponent', () => {
  let component: VideosSubirComponent;
  let fixture: ComponentFixture<VideosSubirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideosSubirComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideosSubirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
