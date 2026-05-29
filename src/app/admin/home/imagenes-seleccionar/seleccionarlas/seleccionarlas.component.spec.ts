import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionarlasComponent } from './seleccionarlas.component';

describe('SeleccionarlasComponent', () => {
  let component: SeleccionarlasComponent;
  let fixture: ComponentFixture<SeleccionarlasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeleccionarlasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeleccionarlasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
