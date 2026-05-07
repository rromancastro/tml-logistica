import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NosotrosOds } from './nosotros-ods';

describe('NosotrosOds', () => {
  let component: NosotrosOds;
  let fixture: ComponentFixture<NosotrosOds>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NosotrosOds],
    }).compileComponents();

    fixture = TestBed.createComponent(NosotrosOds);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
