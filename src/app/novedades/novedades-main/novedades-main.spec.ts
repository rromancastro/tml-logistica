import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovedadesMain } from './novedades-main';

describe('NovedadesMain', () => {
  let component: NovedadesMain;
  let fixture: ComponentFixture<NovedadesMain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovedadesMain],
    }).compileComponents();

    fixture = TestBed.createComponent(NovedadesMain);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
