import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneOffTodoCardComponent } from './one-off-todo-card.component';

describe('OneOffTodoCardComponent', () => {
  let component: OneOffTodoCardComponent;
  let fixture: ComponentFixture<OneOffTodoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OneOffTodoCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OneOffTodoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
