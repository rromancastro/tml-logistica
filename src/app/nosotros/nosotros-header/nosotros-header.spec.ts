import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NosotrosHeader } from './nosotros-header';

describe('NosotrosHeader', () => {
  let component: NosotrosHeader;
  let fixture: ComponentFixture<NosotrosHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NosotrosHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(NosotrosHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
