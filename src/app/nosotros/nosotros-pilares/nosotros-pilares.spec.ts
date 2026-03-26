import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NosotrosPilares } from './nosotros-pilares';

describe('NosotrosPilares', () => {
  let component: NosotrosPilares;
  let fixture: ComponentFixture<NosotrosPilares>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NosotrosPilares],
    }).compileComponents();

    fixture = TestBed.createComponent(NosotrosPilares);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
