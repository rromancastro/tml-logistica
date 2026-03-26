import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NosotrosValores } from './nosotros-valores';

describe('NosotrosValores', () => {
  let component: NosotrosValores;
  let fixture: ComponentFixture<NosotrosValores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NosotrosValores],
    }).compileComponents();

    fixture = TestBed.createComponent(NosotrosValores);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
