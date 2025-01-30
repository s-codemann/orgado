import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoOccuranceCardComponent } from './todo-occurance-card.component';

describe('TodoOccuranceCardComponent', () => {
  let component: TodoOccuranceCardComponent;
  let fixture: ComponentFixture<TodoOccuranceCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoOccuranceCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoOccuranceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
