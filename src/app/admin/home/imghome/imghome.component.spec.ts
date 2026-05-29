import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImghomeComponent } from './imghome.component';

describe('ImghomeComponent', () => {
  let component: ImghomeComponent;
  let fixture: ComponentFixture<ImghomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImghomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImghomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
