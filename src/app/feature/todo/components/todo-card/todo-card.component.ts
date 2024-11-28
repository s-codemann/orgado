import { Component, inject, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TTodo } from '../../todo.store';
import { DatePipe } from '@angular/common';
import { TodosService } from '../../todos.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-todo-card',
  standalone: true,
  imports: [MatCardModule, DatePipe, MatButtonModule],
  templateUrl: './todo-card.component.html',
  styleUrl: './todo-card.component.scss',
})
export class TodoCardComponent {
  private todosService = inject(TodosService);
  readonly todo = input.required<TTodo>();
  getTodos = this.todosService.getTodos;
  todos$!: any;

  deleteTodo(id: number) {
    this.todosService.deleteTodo(id).subscribe((v) => {
      this.todos$ = this.getTodos();
    });
  }
}
