import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarBlogComponent } from './editar-blog.component';

describe('EditarBlogComponent', () => {
  let component: EditarBlogComponent;
  let fixture: ComponentFixture<EditarBlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarBlogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
