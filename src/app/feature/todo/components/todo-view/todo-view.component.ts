import { Component, effect, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TodosService } from '../../todos.service';
import { TodosStore } from '../../todo.store';
import { toSignal } from '@angular/core/rxjs-interop';
import { TodoOccuranceCardComponent } from '../todo-cards/todo-occurance-card/todo-occurance-card.component';
import { RepeatableTodoCardComponent } from '../todo-cards/repeatable-todo-card/repeatable-todo-card.component';
import { OneOffTodoCardComponent } from '../todo-cards/one-off-todo-card/one-off-todo-card.component';
import { MatIcon } from '@angular/material/icon';
import { TodoOccurancesStore } from '../../todoOccurances.store';

@Component({
  selector: 'app-todo-view',
  standalone: true,
  imports: [
    TodoOccuranceCardComponent,
    RepeatableTodoCardComponent,
    OneOffTodoCardComponent,
    MatIcon,
  ],
  templateUrl: './todo-view.component.html',
  styleUrl: './todo-view.component.scss',
})
export class TodoViewComponent implements OnInit {
  displayKind = input('due_tasks');
  protected readonly todosStore = inject(TodosStore);
  protected readonly todoOccurancesStore = inject(TodoOccurancesStore);
  private todoService = inject(TodosService);

  public title = 'auswählen';

  public dueTasks = this.todoOccurancesStore.dueOccurances;
  public repeatableTodos = this.todosStore.repeatableTodos;
  public oneOffTodos = this.todosStore.oneOffTodos;
  public completedTasks = this.todoOccurancesStore.completedOccurances; //toSignal(this.todoService.getCompletedTasks());

  // displayTodosEffect = effect(() => {
  //   if (this.displayKind() === 'due_tasks') {
  //   }
  // });

  private router = inject(Router);

  ngOnInit(): void {}
}
