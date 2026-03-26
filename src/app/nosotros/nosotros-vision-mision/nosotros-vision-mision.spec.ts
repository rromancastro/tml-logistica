import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NosotrosVisionMision } from './nosotros-vision-mision';

describe('NosotrosVisionMision', () => {
  let component: NosotrosVisionMision;
  let fixture: ComponentFixture<NosotrosVisionMision>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NosotrosVisionMision],
    }).compileComponents();

    fixture = TestBed.createComponent(NosotrosVisionMision);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
