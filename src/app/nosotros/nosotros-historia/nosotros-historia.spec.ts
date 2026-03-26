import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NosotrosHistoria } from './nosotros-historia';

describe('NosotrosHistoria', () => {
  let component: NosotrosHistoria;
  let fixture: ComponentFixture<NosotrosHistoria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NosotrosHistoria],
    }).compileComponents();

    fixture = TestBed.createComponent(NosotrosHistoria);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
