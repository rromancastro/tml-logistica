import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovedadesHeader } from './novedades-header';

describe('NovedadesHeader', () => {
  let component: NovedadesHeader;
  let fixture: ComponentFixture<NovedadesHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovedadesHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(NovedadesHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
