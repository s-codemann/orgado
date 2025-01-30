import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepeatableTodoCardComponent } from './repeatable-todo-card.component';

describe('RepeatableTodoCardComponent', () => {
  let component: RepeatableTodoCardComponent;
  let fixture: ComponentFixture<RepeatableTodoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepeatableTodoCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepeatableTodoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
