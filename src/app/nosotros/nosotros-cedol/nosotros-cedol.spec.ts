import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NosotrosCedol } from './nosotros-cedol';

describe('NosotrosCedol', () => {
  let component: NosotrosCedol;
  let fixture: ComponentFixture<NosotrosCedol>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NosotrosCedol],
    }).compileComponents();

    fixture = TestBed.createComponent(NosotrosCedol);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
