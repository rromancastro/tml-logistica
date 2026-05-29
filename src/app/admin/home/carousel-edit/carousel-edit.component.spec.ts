import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselEditComponent } from './carousel-edit.component';

describe('CarouselEditComponent', () => {
  let component: CarouselEditComponent;
  let fixture: ComponentFixture<CarouselEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarouselEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarouselEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
