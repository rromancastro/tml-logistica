import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioHeader } from './inicio-header';

describe('InicioHeader', () => {
  let component: InicioHeader;
  let fixture: ComponentFixture<InicioHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(InicioHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
